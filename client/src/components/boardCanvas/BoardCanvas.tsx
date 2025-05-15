import { useContext, useEffect, useState } from "react";
import { FaCircle } from "react-icons/fa6";
import './boardcanvas.css';
import { AbstergoBoardContext, BoardsContextTypes } from "../../store/BoardsContext";
import { AbstergoAuthContext, AuthContextTypes } from "../../store/AuthContext";
//import Tasks from "../api/boards/tasks/Task";
import { AbstergoTasksContext, TasksContextTypes } from '../../store/TasksContext';
import  { AbstergoModalsContext } from "../../store/ModalsContext";
import { ModalsContextTypes } from '../../store/ModalsContext';
//import Null from "../null/Null";

type Column = {
  columnName: string,
  _id: string,
  cards: []
}

const BoardCanvas: React.FC = () => {
  const { selectedBoard, boardOptionsOpen, boards, setBoardOptionsOpen,
     boardColumns, setBoardColumns,setLoadingColumns}
      = useContext(AbstergoBoardContext) as BoardsContextTypes;

  const { authUserToken } = useContext(AbstergoAuthContext) as AuthContextTypes;
  const { addTask, updateTask, setAddTask } = useContext(AbstergoTasksContext) as TasksContextTypes;
  const {openSingleTaskModal, setOpenSingleTaskModal}= useContext(AbstergoModalsContext) as ModalsContextTypes;
  const {setSingleTaskClose, setSelectedTask} = useContext(AbstergoTasksContext) as TasksContextTypes;

  const [singleBoard, setSingleBoard] = useState<[]>([]);
  
console.log('selectedBoard', selectedBoard)

  useEffect(() => {
    const fetchSingleBoard = async () => {

      setLoadingColumns(true);
      
      const response = await fetch(`/api/boards/${selectedBoard?._id}`, {
        headers: {
          Authorization: `Bearer ${authUserToken}`,
        },
      });
      const data = await response.json();
      setLoadingColumns(false);
      setSingleBoard(data);
      setBoardColumns(data.columns);
    };
    fetchSingleBoard();
  }, [selectedBoard, addTask, updateTask, boards, setAddTask]);

  //console.log(selectedBoard)
  return (
    <section className="board-canvas"  onClick={()=> {




      
      if(boardOptionsOpen){
        setBoardOptionsOpen(false)

      }
    }}>
      {boardColumns && boardColumns.length > 0 ? (
        <div className="columns">
          {boardColumns.map((column: Column) => (
            <div className="column-section" key={column?._id}>
              <div className="column-header">
                <FaCircle color={column.columnName === 'todo' ? 'yellow' :
                  column.columnName === 'in progress' ? 'aqua' :
                    column.columnName === 'done' ? 'lime'
                      : 'yellow'} />
                <p className="column-name-indicator">{column.columnName} ({column.cards.length})</p>
              </div>

              <div className="column-content">
                {column.cards.map((task: any) => (
                  <div className="task-card" key={task._id}
                  onClick={()=> { setOpenSingleTaskModal(!openSingleTaskModal)
                           setSingleTaskClose(false)
                           setSelectedTask(task);

                  }}>
                    <h1 className="task-title">{task.cardTitle}</h1>
                
                    <p className="subtasks-stat">
                      {task.subtasks.filter((subtask: any) => subtask.status==='complete').length} of {task.subtasks.length} subtasks
                    </p>
                
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}

     
    </section>
  );
};

export default BoardCanvas;