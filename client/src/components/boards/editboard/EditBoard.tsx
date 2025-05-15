import { IoCloseSharp } from "react-icons/io5";
import './editboard.css';
import { useContext, useState, useEffect, FormEvent } from "react";
import toast from 'react-hot-toast';
import { RiDeleteBin6Line } from "react-icons/ri";
import ScaleLoader from "react-spinners/ScaleLoader";
import { AbstergoBoardContext, BoardsContextTypes } from "../../../store/BoardsContext";
import { AbstergoAuthContext, AuthContextTypes } from "../../../store/AuthContext";
import { AbstergoModalsContext, ModalsContextTypes } from '../../../store/ModalsContext'

const EditBoard: React.FC = () => {
  // GETTING CONTEXT VARIABLES
  const { editBoardClose, selectedBoard, setBoard, setEditBoardClose } = useContext(AbstergoBoardContext) as BoardsContextTypes;
  const { authUser, authUserToken } = useContext(AbstergoAuthContext) as AuthContextTypes;
  const { openEditBoardModal, setOpenEditBoardModal } = useContext(AbstergoModalsContext) as ModalsContextTypes;

  // VARIABLES AND STATES
  const allowedColumnNames = ['todo', 'in progress', 'done'];
  const [columnName, setColumnName] = useState<{ value: string, placeholder: string, _id: string  }[]>(selectedBoard.columns.map((column) => ({ _id: column._id, value: column.columnName, placeholder: column.columnName })));
  const [boardName, setBoardName] = useState(selectedBoard.boardName);
  const [lastRandomizedWord, setLastRandomizedWord] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // FUNCTION FOR HANDLING COLUMN CHANGES
  const handleColumnChange = (index: number, value: string) => {
    const newColumns = [...columnName];
    newColumns[index].value = value.toLowerCase();
    setColumnName(newColumns);
  };

  // FUNCTION FOR ADDING A NEW COLUMN
  const addColumn = () => {
    if (columnName.length < 3) {
      const availablePlaceholders = allowedColumnNames.filter((placeholder) => !columnName.some((column) => column.value === placeholder));
      if (availablePlaceholders.length > 0) {
        const newPlaceholder = availablePlaceholders[Math.floor(Math.random() * availablePlaceholders.length)];
        const newColumns = [...columnName, { value: '', placeholder: newPlaceholder }];
        setColumnName(newColumns);
        setLastRandomizedWord(newPlaceholder);
      } else {
        toast.error('No more unique placeholders available');
      }
    } else {
      toast.error('Cannot add more than 3 columns');
    }
  };


// FUNCTION FOR DELETING A COLUMN
const removeColumn = async (column: { value: string, placeholder: string, _id: string }) => {
  const newColumns = [...columnName];
  const deletedColumn = newColumns.find((col) => col._id === column._id);
  const columnIndex = newColumns.indexOf(deletedColumn);
  newColumns.splice(columnIndex, 1);
  setColumnName(newColumns);
  if (newColumns.length > 0) {
    setLastRandomizedWord(newColumns[newColumns.length - 1].placeholder);
  } else {
    setLastRandomizedWord('');
  }

  try {
    if (!authUser || !authUserToken || !selectedBoard) {
      return toast.error('Authentication or board data is missing');
    }

    setLoading(true);
    const res = await fetch(`/api/columns/${selectedBoard._id}/${column._id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${authUserToken}` }
    });

   
  } catch (error: unknown) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};

  // FUNCTION FOR UPDATING THE BOARD
  const handleUpdateBoard = async (e: FormEvent) => {
    e.preventDefault();

    if (!boardName.trim()) {
      return toast.error('Board name is required');
    }
  
    if (!authUser || !authUserToken || !selectedBoard) {
      return toast.error('Authentication or board data is missing');
    }
  
    const invalidColumns = columnName.filter((column) => !allowedColumnNames.includes(column.value.toLowerCase()));
    if (invalidColumns.length > 0) {
      return toast.error(`Follow a strict kanban setup, column names can only be "todo", "in progress" or "done"`);
    }
  

    try {
      const columns = columnName.map((column) => {
        if (column.value && column.value.trim() !== '') {
          return { columnName: column.value.toLowerCase(), userId: authUser?._id };
        } else {
          return { columnName: '', userId: authUser?._id }; 
        }
      });

      
     
      setLoading(true);
      const res = await fetch(`/api/boards/${selectedBoard._id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authUserToken}` },
        body: JSON.stringify({ boardName, columns })
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      if (!res.ok) {
        toast.error(data.message);
      } else if (res.ok) {
        toast.success('Board Updated');
        setTimeout(() => {
          location.reload();
        }, 1000);
        setLoading(false);
      }
    } catch (error: unknown) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // USE EFFECTS
  useEffect(() => {
    if (columnName.length > 0) {
      setLastRandomizedWord(columnName[columnName.length - 1].placeholder);
    } else {
      setLastRandomizedWord('');
    }
  }, [columnName]);

  return (
    <section className={editBoardClose ? 'edit-board-closed' : 'edit-board'}>
      <div className="edit-board-card">
        <div className="edit-board-close">
          <IoCloseSharp size={20} onClick={() => { setEditBoardClose(true); setOpenEditBoardModal(!openEditBoardModal); }} />
        </div>
        <h1 className="edit-board-title">Edit Board</h1>
        <form className="edit-board-content" onSubmit={handleUpdateBoard}>
          <div className="editboard-form-inputs">
            <div className="eb-forminputs-boardname">
              <div className="form-input-label">Board Name</div>
              <input type="text" value={boardName} onChange={(e) => setBoardName(e.target.value)} />
            </div>
            {columnName.map((column, index) => (
  <div className="eb-forminputs-column" key={index}>
    <div className="form-input-label">Board Column {index + 1}</div>
    <input type="text" placeholder={`e.g ${column.placeholder}`} value={column.value} onChange={(e) => handleColumnChange(index, e.target.value)} />
    <RiDeleteBin6Line className="delete-column-icon" onClick={() => removeColumn({ ...column, _id: column._id })} />  </div>
))}
            <div className="eb-forminputs-add-column">
              <button type="button" onClick={addColumn}>Add Column</button>
            </div>
          </div>
          <div className="editboard-form-submit">
            <button type="submit">{loading ? <ScaleLoader className="loader" color="#ffffff" height={10} /> : 'Update Board'}</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditBoard;