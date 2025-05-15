import { useContext } from 'react';
import './boardoptions.css';
import { AbstergoBoardContext, BoardsContextTypes } from '../../../store/BoardsContext';
import { AbstergoAuthContext, AuthContextTypes } from '../../../store/AuthContext';
import { AbstergoModalsContext, ModalsContextTypes } from '../../../store/ModalsContext';
import toast from 'react-hot-toast';

const BoardOptions = () => {
  const { selectedBoard, setSelectedBoard, editBoardClose, setEditBoardClose } = useContext(AbstergoBoardContext) as BoardsContextTypes;
  const { authUserToken } = useContext(AbstergoAuthContext) as AuthContextTypes;
  const { openEditBoardModal, setOpenEditBoardModal } = useContext(AbstergoModalsContext) as ModalsContextTypes;

  const handleDeleteBoard = async () => {
    if (!selectedBoard) {
      alert("No board selected or there is a problem with your internet connection");
      return;
    }

    const boardId = selectedBoard._id;
    const deleteBoardConfirm = confirm('This action cannot be reversed, are you sure you want to delete board?')
    if (!deleteBoardConfirm) {
      return;
    }

    try {
      const response = await fetch(`/api/boards/${boardId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authUserToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        toast.success('Board deleted');
        setTimeout(() => {
          location.reload()
        }, 500);
        console.log(data);
      } else {
        toast.error('Failed to delete board');
      }

      setSelectedBoard(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditBoard = () => {


    if (!selectedBoard) {

      alert('No board selected or there is a problem with your internet connection')
    } else {


      setOpenEditBoardModal(!openEditBoardModal);
      setEditBoardClose(!editBoardClose)
    }

  };

  return (
    <section className="board-options">
      <div className="board-options-card">
        <button className="board-option" onClick={handleEditBoard}>Edit Board</button>
        <button className="board-option" onClick={handleDeleteBoard}>Delete Board</button>
      </div>
    </section>
  );
};

export default BoardOptions;