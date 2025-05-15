//IMPORTS

import React, {useState, Dispatch, SetStateAction, useEffect, useContext} from "react";
import { AbstergoAuthContext, AuthContextTypes } from "./AuthContext";
import TasksContext, { AbstergoTasksContext } from "./TasksContext";
//import LoadingColumns from '../components/null/LoadingColumns';
export const AbstergoBoardContext=React.createContext({});



//TYPES

export interface SingleBoardType {
    _id: string;
    boardName: string;
    columns:[]
  
  }
  
  export interface BoardsContextTypes {
    boards: SingleBoardType[];
    selectedBoard: SingleBoardType | null;
    setSelectedBoard: Dispatch<SetStateAction<SingleBoardType | null>>;
    loadingBoards:boolean;
    setLoadingBoards:Dispatch<SetStateAction<boolean>>;
    setCreateBoardClose: Dispatch<SetStateAction<boolean>>;
    boardName: SingleBoardType;
    createBoardClose:boolean;
  
  boardOptionsOpen: boolean;
  setBoardOptionsOpen: Dispatch<SetStateAction<boolean>>;

  LoadingColumns: boolean;
  setLoadingColumns: Dispatch<SetStateAction<boolean>>;
  boardColumns: [];
  setBoardColumns: Dispatch<SetStateAction<[]>>;

  }




const BoardsContext = ({children}: React.PropsWithChildren) => {
    
  const {addTask, setAddTask}= useContext(AbstergoTasksContext) as TasksContext;

    //VARIABLES AND STATES
    const [boardName, setBoardName]= useState<string>('');
    const [loadingBoards, setLoadingBoards]= useState<boolean>(false);
    const [boards, setBoards]= useState([]);
    const [selectedBoard, setSelectedBoard] = useState<SingleBoardType | null>(boards?.[0] ?? null);    
    const [createBoardClose, setCreateBoardClose]= useState<boolean>(false);
    const [editBoardClose, setEditBoardClose]= useState<boolean>(true)
    const {authUserToken}= useContext(AbstergoAuthContext) as AuthContextTypes;
    const [boardOptionsOpen, setBoardOptionsOpen] = useState<boolean>(false);
    const [boardColumns, setBoardColumns] = useState<[]>([]);
    const [loadingColumns, setLoadingColumns]= useState<boolean>(false);


    //USE EFFECTS
     

    //This use effect fetches all boards from the api
    useEffect(() => {
        const fetchAllBoards= async()=>{
  
          try {
            setLoadingBoards(true);
            const response = await fetch(`/api/boards/`, {
              
              method: "GET",
              headers:{
  
                Authorization: `Bearer ${authUserToken}`,
              }
            });
  
            if (!response.ok) {
              throw new Error("Failed to fetch boards");
            }
            const data = await response.json();
           
         
            setBoards(data)
          

            // Set the first board as the selected board immediately
            if (data.length > 0) {
                setSelectedBoard(data[0]);
            localStorage.setItem('selectedBoard', JSON.stringify(data[0]));
              }
            setLoadingBoards(false);
          } catch (error) {
            console.error("Error fetching jobs:", error);
          }
        
        };
    fetchAllBoards()
    }, [ setSelectedBoard, authUserToken, setAddTask, addTask]);  

    
  /* 
    This useEffect assigns the first board in the boards array to the
     selectedBoards variable, the idea behind this is so that the client
     is populated with a default board instead of a blank display */
 /*    useEffect(() => {
        if (boards.length > 0) {
          setSelectedBoard(boards[0]);
        }
      }, [boards]);
 */

 // Update localStorage whenever the selectedBoard changes
  useEffect(() => {
    if (selectedBoard) {
      localStorage.setItem('selectedBoard', JSON.stringify(selectedBoard));
    }
  }, [selectedBoard]);

  return (
    <AbstergoBoardContext.Provider 
    value={{boardName, setBoardName, loadingBoards,
            boards, setBoards, selectedBoard,
             setSelectedBoard, setLoadingBoards,
             createBoardClose, setCreateBoardClose,
             boardOptionsOpen, setBoardOptionsOpen,
             editBoardClose, setEditBoardClose, boardColumns,
             setBoardColumns, loadingColumns, setLoadingColumns
    }}>
{children}

    </AbstergoBoardContext.Provider>
  )
}

export default BoardsContext