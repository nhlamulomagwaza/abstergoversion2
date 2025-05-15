import { useContext } from 'react';
import './taskoptions.css';
import { AbstergoTasksContext, TasksContextTypes } from '../../../store/TasksContext';
import { AbstergoAuthContext, AuthContextTypes } from '../../../store/AuthContext';
import { AbstergoBoardContext, BoardsContextTypes } from '../../../store/BoardsContext';
import toast from 'react-hot-toast';
import { AbstergoModalsContext, ModalsContextTypes } from '../../../store/ModalsContext';


const TaskOptions = () => {
  const { selectedTask, setSelectedTask, setSingleTaskClose } = useContext(AbstergoTasksContext) as TasksContextTypes;
  const { authUserToken } = useContext(AbstergoAuthContext) as AuthContextTypes;
  const { selectedBoard, setSelectedBoard } = useContext(AbstergoBoardContext) as BoardsContextTypes;
  const { openEditTaskModal, setOpenEditTaskModal, openSingleTaskModal, setOpenSingleTaskModal } = useContext(AbstergoModalsContext) as ModalsContextTypes;

  const handleDeleteTask = async () => {
    if (!selectedTask) {
      console.error("Selected task is null or undefined");
      return;
    }

    const taskId = selectedTask._id;
    const columnIndex = selectedBoard.columns.findIndex((column) => column.cards.some((task) => task._id === taskId));
    const columnId = selectedBoard.columns[columnIndex]?._id;
    if (!columnId) {
      console.error("Column ID is null or undefined");
      return;
    }

    const deleteTaskConfirm = confirm('This action cannot be reversed, are you sure you want to delete task?')
    if (!deleteTaskConfirm) {
      return;
    }

    try {
      const response = await fetch(`/api/cards/${selectedBoard._id}/${columnId}/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authUserToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        toast.success('Task deleted');
        setSingleTaskClose(true);
        console.log(data);
      } else {
        toast.error('Failed to delete task');
      }

      const updatedBoard = { ...selectedBoard };
      const columnIndex = updatedBoard.columns.findIndex((column) => column.cards.some((task) => task._id === taskId));
      if (columnIndex === -1) {
        console.error("Column not found");
        return;
      }

      const taskIndex = updatedBoard.columns[columnIndex].cards.findIndex((task) => task._id === taskId);
      if (taskIndex === -1) {
        console.error("Task not found");
        return;
      }

      updatedBoard.columns[columnIndex].cards.splice(taskIndex, 1);

      setSelectedBoard(updatedBoard);
      setSelectedTask(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditTask = () => {
    setOpenEditTaskModal(!openEditTaskModal);
    setOpenSingleTaskModal(!openSingleTaskModal);
    setSingleTaskClose(true);
  };

  return (
    <section className="task-options">
      <div className="task-options-card">
        <button className="task-option" onClick={handleEditTask}>Edit Task</button>
        <button className="task-option" onClick={handleDeleteTask}>Delete Task</button>
      </div>
    </section>
  );
};

export default TaskOptions;