//IMPORTS
import React, {Dispatch, SetStateAction, useState } from "react";
export const AbstergoModalsContext= React.createContext({});


//TYPES

export interface ModalsContextTypes{

    openCreateBoardModal: boolean;
    setOpenCreateBoardModal: Dispatch<SetStateAction<boolean>>;
    openCreateCardModal: boolean;
    setOpenCreateCardModal: Dispatch<SetStateAction<boolean>>;
    openSingleTaskModal: boolean;
    setOpenSingleTaskModal: Dispatch<SetStateAction<boolean>>;
    openEditTaskModal: boolean;
    setOpenEditTaskModal: Dispatch<SetStateAction<boolean>>;
    openEditBoardModal: boolean;
    setOpenEditBoardModal: Dispatch<SetStateAction<boolean>>;
}

const ModalsContext = ({children}: React.PropsWithChildren) => {


    //VARIABLES AND STATES
    const [openCreateBoardModal, setOpenCreateBoardModal]= useState(false);
    const [openCreateCardModal, setOpenCreateCardModal]= useState(false)
    const [openSingleTaskModal, setOpenSingleTaskModal]= useState(false);
    const [openEditTaskModal, setOpenEditTaskModal]= useState(false);
    const [openEditBoardModal, setOpenEditBoardModal]= useState(false);



  return (
   <AbstergoModalsContext.Provider 
   value={{openCreateBoardModal, setOpenCreateBoardModal,
           openCreateCardModal, setOpenCreateCardModal,
           openSingleTaskModal, setOpenSingleTaskModal,
           openEditTaskModal, setOpenEditTaskModal,
           openEditBoardModal, setOpenEditBoardModal
   }}>
    {children}
   </AbstergoModalsContext.Provider>
  )
}

export default ModalsContext