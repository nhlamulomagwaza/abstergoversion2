//IMPORTS

import { FaPlus } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import './belt.css';
import { useContext } from "react";
import { AbstergoCardContext, CardsContextTypes } from "../../store/CardsContext";
import { AbstergoModalsContext, ModalsContextTypes } from "../../store/ModalsContext";
import BoardOptions from "../boards/options/BoardOptions";
import { AbstergoBoardContext, BoardsContextTypes } from '../../store/BoardsContext';





const Belt: React.FC = () => {

  //GET VARIABLES FROM CONTEXT
  const { selectedBoard, boardOptionsOpen, setBoardOptionsOpen } = useContext(AbstergoBoardContext) as BoardsContextTypes;
  const { setCreateCardClose } = useContext(AbstergoCardContext) as CardsContextTypes;
  const { setOpenCreateCardModal, openCreateCardModal } = useContext(AbstergoModalsContext) as ModalsContextTypes;

  return (
    <>
      <div className="belt" onClick={() => {
        if (boardOptionsOpen) {
          setBoardOptionsOpen(false)

        }
      }}>

        {boardOptionsOpen ? (

          <BoardOptions />
        ) : null}


        <div className="belt-content">

          <h1 className="board-title">{selectedBoard?.boardName || 'No board selected'}</h1>



          <div className="btn-options">

            <button className="add-new-task"
              onClick={() => {

                if (!selectedBoard) {

                  alert('No board selected or there is a problem with your internet connection')
                } else {


                  setOpenCreateCardModal(!openCreateCardModal)

                  setCreateCardClose(false)
                }
              }}
            >

              <FaPlus /><p>Add New Task</p></button>
            <button className="btn-dots"><HiOutlineDotsVertical size={25} onClick={() => setBoardOptionsOpen(!boardOptionsOpen)} /></button>
          </div>


        </div>

      </div>

    </>
  )
}

export default Belt