import { useContext } from 'react';
import './null.css';
import { FaPlus } from "react-icons/fa";
import { AbstergoBoardContext, BoardsContextTypes } from '../../store/BoardsContext';
import { AbstergoModalsContext, ModalsContextTypes } from '../../store/ModalsContext';
const Null = () => {

  const { editBoardClose, setEditBoardClose } = useContext(AbstergoBoardContext) as BoardsContextTypes
  const { setOpenEditBoardModal, openEditBoardModal } = useContext(AbstergoModalsContext) as ModalsContextTypes;

  const handleEditBoard = () => {
    setOpenEditBoardModal(!openEditBoardModal);
    setEditBoardClose(!editBoardClose)

  };

  return (
    <>
      <div className="null">


        <div className="null-content">



          <h1 className="null-title">This board is empty. Create a new column to get started.</h1>
          <button className="add-new-column-btn" onClick={handleEditBoard}><FaPlus /><p>Add a column</p></button>

        </div>
      </div>

    </>
  )
}

export default Null