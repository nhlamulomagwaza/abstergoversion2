//IMPORTS

import { IoCloseSharp } from "react-icons/io5";
import './createcard.css';
import { useContext, useState, useEffect, FormEvent } from "react";
import { useRef } from 'react'
import toast from 'react-hot-toast';
import { RiDeleteBin6Line } from "react-icons/ri";
import ScaleLoader from "react-spinners/ScaleLoader";
import { AbstergoModalsContext, ModalsContextTypes } from '../../../store/ModalsContext';
import { AbstergoCardContext, CardsContextTypes } from "../../../store/CardsContext";
import { AbstergoBoardContext, BoardsContextTypes } from "../../../store/BoardsContext";
import { AbstergoAuthContext, AuthContextTypes } from "../../../store/AuthContext";
import { AbstergoTasksContext } from "../../../store/TasksContext";

const CreateCard: React.FC = () => {
  const { openCreateCardModal, setOpenCreateCardModal } = useContext(AbstergoModalsContext) as ModalsContextTypes;
  const { setCreateCardClose, createCardClose, cardTitle, setCardTitle, cardDescription, setCardDescription, subtasks, setSubtasks } = useContext(AbstergoCardContext) as CardsContextTypes;
  const { authUserToken, authUser } = useContext(AbstergoAuthContext) as AuthContextTypes;
  const { selectedBoard, setSelectedBoard } = useContext(AbstergoBoardContext) as BoardsContextTypes;
  const { setAddTask, addTask } = useContext(AbstergoTasksContext);

  console.log(selectedBoard?.columns)

  const [showDescription, setShowDescription] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('todo');
  const selectRef = useRef<HTMLSelectElement>(null);

  const handleAddSubtask = () => {
    if (subtasks.length > 2) {
      return toast.error('Cannot add more than 3 subtasks')
    }
    setSubtasks([...subtasks, { subtaskTitle: '', userId: authUser._id }]);
  };

  const handleSubtaskChange = (index: number, value: string) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index] = { ...updatedSubtasks[index], subtaskTitle: value };
    setSubtasks(updatedSubtasks);
  };

const handleCreateCard = async (e: FormEvent) => {
    e.preventDefault();

    if (!cardTitle.trim()) {
        return toast.error('Task name is required');
    }

    if (!selectedBoard) {
        return toast.error('No board selected');
    }

    const boardId = selectedBoard?._id;
    const columns = selectedBoard?.columns;

    const columnId = columns?.find((column) => column.columnName === selectedStatus)?._id;

    if (!columnId) {
        return toast.error('Invalid task status');
    }

    if (!authUser) {
        return toast.error('User not authenticated');
    }

    const formattedSubtasks = subtasks.filter((subtask) => subtask.subtaskTitle.trim() !== '').map((subtask) => ({
        subtaskTitle: subtask.subtaskTitle,
        userId: authUser?._id,
    }));

    try {
        setLoading(true);
        const response = await fetch(`/api/cards/${boardId}/${columnId}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authUserToken}`,
            },
            body: JSON.stringify({
                cardTitle: cardTitle,
                description: cardDescription,
                status: selectedStatus,
                subtasks: formattedSubtasks,
            }),
        });

        if (response.ok) {
            const newCard = await response.json(); // Assuming the server returns the created card

            // Update the client-side state
            const updatedColumns = columns.map((column) => {
                if (column._id === columnId) {
                    return {
                        ...column,
                        cards: [...(column.cards || []), newCard], // Add the new card to the column
                    };
                }
                return column;
            });

            // Update the selectedBoard with the updated columns
            setSelectedBoard((prevBoard) => ({
                ...prevBoard,
                columns: updatedColumns,
            }));

            // Force a re-render by updating a dummy state
            setAddTask((prev) => prev + 1);

            toast.success('Card created successfully!');
            setLoading(false);
            setCardTitle('');
            setCardDescription('');
            setSubtasks([]);

            location.reload();
        } else {
            setLoading(false);
            return toast.error('Failed to create card');
        }
    } catch (error) {
        console.error(error);
        setLoading(false);
        return toast.error('Failed to create card');
    }
};




  //--------JSX
  return (
    <section className={createCardClose ? 'create-card-closed' : 'create-card'}>
      <div className="create-card-container">
        <div className="create-card-close">
          <IoCloseSharp size={20}
            onClick={() => {
              setCreateCardClose(true);
              setOpenCreateCardModal(!openCreateCardModal);
            }}
          />
        </div>
        <h1 className="create-card-title">Add New Task</h1>
        <form className="create-card-content" onSubmit={handleCreateCard}>
          <div className="createcard-form-inputs">
            <div className="cb-forminputs-column">
              <div className="form-input-label">Task Name</div>
              <input type="text" placeholder="e.g Clean Kitchen"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
              />
            </div>


            {showDescription && (
              <div className="cb-forminputs-column">
                <div className="form-input-label">Description(optional)</div>
                <textarea
                  placeholder="e.g Clean kitchen using PineGel soap"
                  value={cardDescription}
                  onChange={(e) => setCardDescription(e.target.value)}
                />
                <RiDeleteBin6Line
                  className="delete-column-icon"
                  onClick={() => setShowDescription(false)}
                />
              </div>
            )}

            {!showDescription && (
              <div className="cb-forminputs-column">

                <button type="button" className="add-description" onClick={() => setShowDescription(true)}>
                  Add Description
                </button>
              </div>
            )}
            {subtasks.map((subtask, index) => (
              <div className="cb-forminputs-column" key={index}>
                <div className="form-input-label">Subtask {index + 1}</div>
                <input
                  type="text"
                  placeholder={`e.g Replace the microwave`}
                  value={subtask.subtaskTitle}
                  onChange={(e) => handleSubtaskChange(index, e.target.value)}
                />
                <RiDeleteBin6Line
                  className="delete-column-icon"
                  onClick={() => setSubtasks(subtasks.filter((_, i) => i !== index))}
                />
              </div>
            ))}

          </div>
          <div className="createcard-addmore-subtasks">
            <button type="button" onClick={handleAddSubtask} >Add New Subtask</button>
          </div>
          <div className="cb-forminputs-column">
            <div className="form-input-label">Task Status</div>
            <select defaultValue={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="todo">Todo</option>
              <option value="in progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="createcard-form-submit">
            <button type="submit">{loading ? <ScaleLoader className="loader" color="#ffffff" height={10} /> : 'Create Task'}</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateCard;