import { useContext, useState, useEffect } from 'react';
import './task.css';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoCloseSharp } from "react-icons/io5";

import { AbstergoModalsContext, ModalsContextTypes } from '../../../store/ModalsContext';
import { AbstergoTasksContext, TasksContextTypes } from '../../../store/TasksContext';
import { AbstergoAuthContext, AuthContextTypes } from '../../../store/AuthContext';
import { AbstergoBoardContext, BoardsContextTypes } from '../../../store/BoardsContext';
import TaskOptions from '../options/TaskOptions';

const Task = () => {
  const { openSingleTaskModal, setOpenSingleTaskModal } = useContext(AbstergoModalsContext) as ModalsContextTypes;
  const { setSingleTaskClose, singleTaskClose, selectedTask, setSelectedTask,
    taskOptionsOpen, setTaskOptionsOpen
  } = useContext(AbstergoTasksContext) as TasksContextTypes;


  const { authUserToken } = useContext(AbstergoAuthContext) as AuthContextTypes;
  const { selectedBoard, setSelectedBoard } = useContext(AbstergoBoardContext) as BoardsContextTypes;
  // console.log(selectedTask);

  const columnId = selectedBoard?.columns.find((column) => {
    return column.cards?.some((task) => task._id === selectedTask?._id);
  })?._id;


  //const taskId= selectedTask?._id;

  const [subtaskChecks, setSubtaskChecks] = useState(
    selectedTask?.subtasks?.map(() => false) || []
  );

  const [newStatus, setNewStatus] = useState(selectedTask?.status);

  useEffect(() => {
    const updateTaskStatus = (taskId: string, newStatus: string, newColumnId: string) => {

      fetch(`/api/cards/${selectedBoard?._id}/${taskId}/${newColumnId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authUserToken}` },
        body: JSON.stringify({ status: newStatus }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Update the selectedTask state with the new status and column ID
          setSelectedTask({ ...selectedTask, status: newStatus, columnId: newColumnId });

          // Update the newStatus state with the new column ID
       //   setNewStatus(newColumnId);

          // Updating the task position in the column
          const updatedBoard = { ...selectedBoard };
          const oldColumnIndex = updatedBoard.columns.findIndex((column) => column._id === columnId);
          const taskIndex = updatedBoard.columns[oldColumnIndex].cards.findIndex((task) => task._id === taskId);
          const taskToRemove = updatedBoard.columns[oldColumnIndex].cards.splice(taskIndex, 1)[0];

          // Adding the task to the new column
          const newColumnIndex = updatedBoard.columns.findIndex((column) => column._id === newColumnId);
          updatedBoard.columns[newColumnIndex].cards.push(taskToRemove);

          // Updating the selectedBoard state with the updated column
          setSelectedBoard(updatedBoard);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    if (newStatus !== selectedTask?.status) {
      const newColumnId = selectedBoard.columns.find((column) => column.columnName === newStatus)?._id;
      if (newColumnId) {
        updateTaskStatus(selectedTask?._id, newStatus, newColumnId);
      } else {
        console.error('Column ID not found');
      }
    }
  }, [newStatus, selectedTask, selectedBoard]);
  const handleSubtaskCheck = (index: number) => {
    const newSubtaskChecks = [...subtaskChecks];
    newSubtaskChecks[index] = !newSubtaskChecks[index];
    setSubtaskChecks(newSubtaskChecks);


    const subtaskId = selectedTask?.subtasks[index]?._id;
    if (subtaskId) {
      fetch(`/api/subtasks/${selectedBoard?._id}/${columnId}/${selectedTask?._id}/${subtaskId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authUserToken}` },
        body: JSON.stringify({ status: newSubtaskChecks[index] ? 'complete' : 'incomplete' }),
      })
        .then((response) => response.json())
        .then((data) => {

          const updatedSubtasks = [...selectedTask.subtasks];
          updatedSubtasks[index].status = newSubtaskChecks[index] ? 'complete' : 'incomplete';
          setSelectedTask({ ...selectedTask, subtasks: updatedSubtasks });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  const handleStatusChange = (event) => {
    setNewStatus(event.target.value);
  };
  //console.log('task options is ',taskOptionsOpen)

  if (!selectedTask) {
    return;
  }
  return (
    <>
      <section className={singleTaskClose ? 'task-closed' : 'task'}>
        <div className="task-container">
          <div className="single-task-card" onClick={() => {
            if (taskOptionsOpen) {
              setTaskOptionsOpen(false)
            }
          }}>

            <IoCloseSharp
              className='single-task-close'
              size={20}
              onClick={() => {
                setSingleTaskClose(true);
                setOpenSingleTaskModal(!openSingleTaskModal);
              }}
            />
            <div className="task-card-header">
              <h1 className="single-task-title">{selectedTask.cardTitle}</h1>
              <HiOutlineDotsVertical size={20} className="single-task-dots" onClick={() => setTaskOptionsOpen(!taskOptionsOpen)} />
              {taskOptionsOpen && selectedTask ? (
                <TaskOptions />
              ) : null}

            </div>

            <div className="task-card-description">
              {selectedTask?.description || 'No Task description'}
            </div>

            <div className="subtasks-progress">
              Subtasks ({selectedTask?.subtasks?.filter((subtask) => subtask.status === 'complete').length} of {selectedTask?.subtasks?.length || 0})
            </div>

            <div className="subtasks-checks">
              {selectedTask?.subtasks?.length > 0 ? (
                selectedTask?.subtasks?.map((subtask, index) => (
                  <div className="subtask-check" key={index} style={subtask.status === 'complete' ? { backgroundColor: '#212121', color: 'grey' } : { textDecoration: 'none' }}>
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      className='single-task-checkbox'
                      checked={subtask.status === 'complete'}
                      onClick={() => handleSubtaskCheck(index)}
                    />
                    <p
                      className='task-card-subtask-label'
                      style={subtask.status === 'complete' ? { textDecoration: 'line-through' } : { textDecoration: 'none' }}
                    >
                      {subtask.subtaskTitle}
                    </p>
                  </div>
                ))
              ) : (
                'No subtasks'
              )}
            </div>

            <div className="status">
              <p className='status-label'>Current Status</p>
              <select
                name=""
                id=""
                style={{ cursor: 'pointer' }}
                value={newStatus}
                onChange={handleStatusChange}
              >
                <option value="todo">Todo</option>
                <option value="in progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Task;