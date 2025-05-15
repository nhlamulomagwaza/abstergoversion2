import { useContext } from 'react';
import './null.css';
import { FaPlus } from "react-icons/fa";
import { AbstergoBoardContext, BoardsContextTypes } from '../../store/BoardsContext';
import { AbstergoModalsContext, ModalsContextTypes } from '../../store/ModalsContext';
const NoBoard = () => {

  const { setCreateBoardClose } = useContext(AbstergoBoardContext) as BoardsContextTypes
  const { openCreateBoardModal, setOpenCreateBoardModal } = useContext(AbstergoModalsContext) as ModalsContextTypes;



  return (
    <>
      <div className="null">


        <div className="null-content">



          <h1 className="null-title">You don't have a board yet, create a board to get started</h1>
          <button className="add-new-column-btn"
            onClick={() => {
              setOpenCreateBoardModal(!openCreateBoardModal)

              setCreateBoardClose(false)
            }}>
            <FaPlus /><p>Create Board</p></button>

        </div>
      </div>

    </>
  )
}

export default NoBoard