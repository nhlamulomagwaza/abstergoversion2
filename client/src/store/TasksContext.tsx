//IMPORTS

import React, { useState, Dispatch, SetStateAction, useEffect, useContext } from "react";
import { AbstergoAuthContext, AuthContextTypes } from "./AuthContext";
import { AbstergoBoardContext, BoardsContextTypes } from "./BoardsContext";
import CardsContext, { AbstergoCardContext } from "./CardsContext";
export const AbstergoTasksContext = React.createContext({});



//TYPES

export interface SingleCardType {
  _id: string;
  cardTitle: string;
  description: string;

}

export interface TasksContextTypes {


  tasks: []
  setTasks: Dispatch<SetStateAction<[]>>;
  loadingTasks: boolean;
  setLoadingTasks: Dispatch<SetStateAction<boolean>>;
  addTask: boolean;
  setAddTask: Dispatch<SetStateAction<number>>;

  taskOptionsOpen: boolean;
  setTaskOptionsOpen: Dispatch<SetStateAction<boolean>>;
  updateTask: boolean;
  setUpdateTask: Dispatch<SetStateAction<number>>;
  singleTaskClose: boolean;
  setSingleTaskClose: Dispatch<SetStateAction<boolean>>;
  selectedTask: any;
  setSelectedTask: Dispatch<SetStateAction<any>>;
}




const TasksContext = ({ children }: React.PropsWithChildren) => {


  const cards= useContext(AbstergoCardContext) as CardsContext;


  //VARIABLES AND STATES

  const [tasks, setTasks] = useState<[]>([]);
  const [loadingTasks, setLoadingTasks] = useState<boolean>(false);
  const { authUserToken } = useContext(AbstergoAuthContext) as AuthContextTypes;
  const { selectedBoard } = useContext(AbstergoBoardContext) as BoardsContextTypes;
  const [addTask, setAddTask] = useState<number>(0);
  const [updateTask, setUpdateTask] = useState<number>(0);
  const [singleTaskClose, setSingleTaskClose] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<any>(null); // Add a new state variable for the selected task
  const [taskOptionsOpen, setTaskOptionsOpen] = useState<boolean>(false);


  //USE EFFECTS


  //This use effect fetches all cards from the api
  useEffect(() => {

    const fetchTasks = async () => {
      setLoadingTasks(true);
      const response = await fetch(`/api/boards/${selectedBoard?._id}`, {

        headers: {

          Authorization: `Bearer ${authUserToken}`,
        },
      });
      const data = await response.json();
      const cards = data.columns?.map((column: any) => column.cards);
       
      setTasks(cards)
     
      setLoadingTasks(false);
      //console.log(cards)
    };
    fetchTasks()
  }, [selectedBoard, cards, tasks, authUserToken, addTask, updateTask, singleTaskClose, setTasks, authUserToken]);


  /* 
    This useEffect assigns the first card in the cards array to the
     selectedcards variable, the idea behind this is so that the client
     is populated with a default card instead of a blank display */
  /*  useEffect(() => {
       if (cards.length > 0) {
         setSelectedcard(cards[0]);
       }
     }, [cards]);
*/

  return (
    <AbstergoTasksContext.Provider
      value={{
        loadingTasks, setLoadingTasks, tasks,
        addTask, setAddTask, singleTaskClose,
        setSingleTaskClose, selectedTask, setSelectedTask,
        taskOptionsOpen, setTaskOptionsOpen,
        updateTask, setUpdateTask
      }}>
      {children}

    </AbstergoTasksContext.Provider>
  )
}

export default TasksContext