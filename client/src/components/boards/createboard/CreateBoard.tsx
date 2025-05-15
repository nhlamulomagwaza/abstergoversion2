//IMPORTS

import { IoCloseSharp } from "react-icons/io5";
import "./createboard.css";
import { useContext, useState, useEffect, FormEvent } from "react";

import toast from "react-hot-toast";
import { RiDeleteBin6Line } from "react-icons/ri";
import ScaleLoader from "react-spinners/ScaleLoader";
import {
  AbstergoBoardContext,
  BoardsContextTypes,
} from "../../../store/BoardsContext";
import {
  AbstergoAuthContext,
  AuthContextTypes,
} from "../../../store/AuthContext";
import {
  AbstergoModalsContext,
  ModalsContextTypes,
} from "../../../store/ModalsContext";

const CreateBoard: React.FC = () => {
  //GETTING CONTEXT VARIABLES
  const { createBoardClose, boardName, setBoardName, setCreateBoardClose } =
    useContext(AbstergoBoardContext) as BoardsContextTypes;
  const { authUser, authUserToken } = useContext(
    AbstergoAuthContext
  ) as AuthContextTypes;
  const { openCreateBoardModal, setOpenCreateBoardModal } = useContext(
    AbstergoModalsContext
  ) as ModalsContextTypes;

  //VARIABLES AND STATES
  const allowedColumnNames = ["todo", "in progress", "done"];
  const placeholderWords = allowedColumnNames;
  const [columnName, setColumnName] = useState<
    { value: string; placeholder: string }[]
  >([
    {
      value: "",
      placeholder:
        placeholderWords[Math.floor(Math.random() * placeholderWords.length)],
    },
  ]);
  const [lastRandomizedWord, setLastRandomizedWord] = useState<string>("");
  const [loading, setLoading] = useState(false);

  //Function for handling column changes, AKA input fields for adding new columns
  const handleColumnChange = (index: number, value: string) => {
    const newColumns = [...columnName];
    newColumns[index].value = value.toLowerCase();
    setColumnName(newColumns);
  };

  //Function for creating a column, adding new input field to add column

  const addColumn = () => {
    if (columnName.length < 3) {
      const availablePlaceholders = placeholderWords.filter(
        (placeholder) =>
          !columnName.some((column) => column.placeholder === placeholder)
      );
      if (availablePlaceholders.length > 0) {
        const newPlaceholder =
          availablePlaceholders[
            Math.floor(Math.random() * availablePlaceholders.length)
          ];
        const newColumns = [
          ...columnName,
          { value: "", placeholder: newPlaceholder },
        ];
        setColumnName(newColumns);
        setLastRandomizedWord(newPlaceholder);
      } else {
        toast.error("No more unique placeholders available");
      }
    } else {
      toast.error("Cannot add more than 3 columns");
    }
  };

  //Function for deleting a column, deleting previous input field for adding column
  const removeColumn = (index: number) => {
    const newColumns = [...columnName];
    newColumns.splice(index, 1);
    setColumnName(newColumns);
    if (newColumns.length > 0) {
      setLastRandomizedWord(newColumns[newColumns.length - 1].placeholder);
    } else {
      setLastRandomizedWord("");
    }
  };

  //Below function makes an api call to create a new board

  const handleCreateBoard = async (e: FormEvent) => {
    e.preventDefault();

    if (!boardName.trim()) {
      return toast.error("Board name is required");
    }

    const invalidColumns = columnName.filter(
      (column) => !allowedColumnNames.includes(column.value.toLowerCase())
    );
    if (invalidColumns.length > 0) {
      return toast.error(
        `follow a strict kanban setup, column names can only be "todo", "in progress" or "done"`
      );
    }

    try {
      const columns = columnName.map((column) => ({
        columnName: column.value.toLowerCase(),
        userId: authUser?._id,
      }));
      setLoading(true);
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUserToken}`,
        },
        body: JSON.stringify({ boardName, columns }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      if (!res.ok) {
        toast.error(data.message);
      } else if (res.ok) {
        toast.success("Board Created");
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

  //USE EFFECTS
  /* THE UseEffect code below makes sure that the randomized words in the placeholders
  do not repeat themselves */

  useEffect(() => {
    if (columnName.length > 0) {
      setLastRandomizedWord(columnName[columnName.length - 1].placeholder);
    } else {
      setLastRandomizedWord("");
    }
  }, [columnName]);

  //--------JSX
  return (
    <section
      className={createBoardClose ? "create-board-closed" : "create-board"}
    >
      <div className="create-board-card">
        <div className="create-board-close">
          <IoCloseSharp
            size={20}
            onClick={() => {
              setCreateBoardClose(true);
              setOpenCreateBoardModal(!openCreateBoardModal);
            }}
          />
        </div>
        <h1 className="create-board-title">Add New Board</h1>
        <form className="create-board-content" onSubmit={handleCreateBoard}>
          <div className="createboard-form-inputs">
            <div className="cb-forminputs-column">
              <div className="form-input-label">Board Name</div>
              <input
                type="text"
                placeholder="e.g House Chores"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
              />
            </div>
            {columnName.map((column, index) => (
              <div className="cb-forminputs-column" key={index}>
                <div className="form-input-label">Board Column {index + 1}</div>
                <input
                  type="text"
                  placeholder={`e.g ${column.placeholder}`}
                  value={column.value}
                  onChange={(e) => handleColumnChange(index, e.target.value)}
                />
                <RiDeleteBin6Line
                  className="delete-column-icon"
                  onClick={() => removeColumn(index)}
                />
              </div>
            ))}
          </div>
          <div className="createboard-addmore-columns">
            <button type="button" onClick={addColumn}>
              Add New Column
            </button>
          </div>
          <div className="createboard-form-submit">
            <button type="submit">
              {loading ? (
                <ScaleLoader className="loader" color="#ffffff" height={10} />
              ) : (
                "Create Board"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateBoard;
