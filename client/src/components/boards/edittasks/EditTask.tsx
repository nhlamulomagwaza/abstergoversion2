import { useState, useEffect, FormEvent } from "react";
import { useContext } from "react";
import { AbstergoModalsContext, ModalsContextTypes } from "../../../store/ModalsContext";
//import { AbstergoCardContext, CardsContextTypes } from "../../../store/CardsContext";
import { AbstergoBoardContext, BoardsContextTypes } from "../../../store/BoardsContext";
import { AbstergoAuthContext, AuthContextTypes } from "../../../store/AuthContext";
import { AbstergoTasksContext, TasksContextTypes } from "../../../store/TasksContext";
import toast from "react-hot-toast";
import ScaleLoader from "react-spinners/ScaleLoader";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";
import './editcard.css';


const EditTask: React.FC = () => {
  const { openEditTaskModal, setOpenEditTaskModal } = useContext(AbstergoModalsContext) as ModalsContextTypes;
  const { selectedTask, setSelectedTask } = useContext(AbstergoTasksContext) as TasksContextTypes;
  const { authUserToken, authUser } = useContext(AbstergoAuthContext) as AuthContextTypes;
  const { selectedBoard } = useContext(AbstergoBoardContext) as BoardsContextTypes;
  const { setUpdateTask, updateTask } = useContext(AbstergoTasksContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [showDescription, setShowDescription] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<string>(selectedTask?.status);
  const [cardTitle, setCardTitle] = useState<string>(selectedTask?.cardTitle);
  const [cardDescription, setCardDescription] = useState<string>(selectedTask?.description);
  const [subtasks, setSubtasks] = useState<any[]>(selectedTask?.subtasks);

  console.log(selectedBoard)
  useEffect(() => {
    if (!selectedTask) {
      return;
    }
    setCardTitle(selectedTask.title);
    setCardDescription(selectedTask.description);
    setSubtasks(selectedTask.subtasks);
  }, [selectedTask]);

  const handleUpdateTask = async (e: FormEvent) => {
    e.preventDefault();



    if (!selectedBoard) {
      return toast.error("No board selected");
    }

    const boardId = selectedBoard?._id;
    const columns = selectedBoard?.columns;

    const columnId = columns?.find((column) => column.columnName === selectedStatus)?._id;

    if (!columnId) {
      return toast.error("Invalid task status");
    }

    if (!authUser) {
      return toast.error("User not authenticated");
    }

    const formattedSubtasks = subtasks.filter((subtask) => subtask.subtaskTitle?.trim() !== "").map((subtask) => ({
      subtaskTitle: subtask.subtaskTitle,
      userId: authUser?._id,
    }));

    try {
      setLoading(true);
      const response = await fetch(`/api/cards/${boardId}/${selectedTask._id}/${columnId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUserToken}`,
        },
        body: JSON.stringify({
          cardTitle: cardTitle,
          description: cardDescription === '' ? null : cardDescription,
          status: selectedStatus,
          subtasks: formattedSubtasks,
        }),
      });
      console.log(response)

      /*  if(response.status==401){
       
       setLoading(false)
         return toast.error("No changes detected");
       } */
      if (response.ok) {

        toast.success("Task updated successfully!");
        setOpenEditTaskModal(!openEditTaskModal);
        setUpdateTask(updateTask + 1);
        setLoading(false);
        setSelectedTask(null);
      } else {
        setLoading(false);
        return toast.error("Failed to update task");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      return toast.error("Failed to update task");
    }
  };

  const handleAddSubtask = () => {
    if (subtasks.length > 2) {
      return toast.error("Cannot add more than 3 subtasks");
    }
    setSubtasks([...subtasks, { subtaskTitle: "", userId: authUser._id }]);
  };

  const handleSubtaskChange = (index: number, value: string) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index] = { ...updatedSubtasks[index], subtaskTitle: value };
    setSubtasks(updatedSubtasks);
  };
  useEffect(() => {
    if (!showDescription) {
      setCardDescription('');
      setSelectedTask({ ...selectedTask, description: '' });
    }
  }, [showDescription]);
  return (
    <section className={openEditTaskModal ? "edit-task-modal" : "edit-task-modal-closed"}>
      <div className="edit-task-container">
        <div className="edit-task-close">
          <IoCloseSharp
            size={20}
            onClick={() => {
              setOpenEditTaskModal(!openEditTaskModal);
              setSelectedTask(null);
            }}
          />
        </div>
        <h1 className="edit-task-title">Edit Task</h1>
        <form className="edit-task-content" onSubmit={handleUpdateTask}>
          <div className="edit-task-form-inputs">
            <div className="cb-forminputs-column">
              <div className="form-input-label">Task Name</div>
              <input
                type="text"
                placeholder="e.g Clean Kitchen"
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
                  onClick={() => {
                    setShowDescription(false)

                    setCardDescription(`${null}`);
                    setSelectedTask({ ...selectedTask, description: `${null}` });
                  }}

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

            {subtasks?.map((subtask, index) => (
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
          <div className="edit-task-addmore-subtasks">
            <button type="button" onClick={handleAddSubtask}>
              Add New Subtask
            </button>
          </div>
          <div className="cb-forminputs-column">
            <div className="form-input-label">Task Status</div>
            <select defaultValue={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="todo">Todo</option>
              <option value="in progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="edit-task-form-submit">
            <button type="submit">
              {loading ? (
                <ScaleLoader className="loader" color="#ffffff" height={10} />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
};

export default EditTask;