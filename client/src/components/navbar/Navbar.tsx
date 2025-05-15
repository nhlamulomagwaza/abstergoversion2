//IMPORTS

import { GrTechnology } from "react-icons/gr";
import { FaClipboardList } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { IoMdHelp } from "react-icons/io";
import MoonLoader from "react-spinners/SyncLoader";
//import { IoLogoAmplify } from "react-icons/io5";
//import { IoLogoCapacitor } from "react-icons/io5";
import './navbar.css';
import { useContext } from "react";
import { FaCalendarPlus } from "react-icons/fa";
import { AbstergoBoardContext, BoardsContextTypes, SingleBoardType } from "../../store/BoardsContext";
import { AbstergoAuthContext, AuthContextTypes } from "../../store/AuthContext";
import { AbstergoModalsContext, ModalsContextTypes } from "../../store/ModalsContext";
import { AbstergoGeneralContext } from "../../store/GeneralContext";
import { useHref } from "react-router-dom";



const Navbar: React.FunctionComponent = () => {


  //GET VARIABLES FROM CONTEXT

  const { setSelectedBoard, boards, setCreateBoardClose, selectedBoard, loadingBoards } = useContext(AbstergoBoardContext) as BoardsContextTypes;
  const { logoutUser } = useContext(AbstergoAuthContext) as AuthContextTypes;
  const { openCreateBoardModal, setOpenCreateBoardModal } = useContext(AbstergoModalsContext) as ModalsContextTypes;
  const { showNavbar } = useContext(AbstergoGeneralContext);

  //THIS FUNCTION SELECTS A BOARD, AND IT STORES THE BOARD DATA TO BE RESUSED
  const handleBoardClick = (board: SingleBoardType) => {
    setSelectedBoard(board);

  };
  const handleTutorialClick = () => {
    window.open("https://kanbantool.com/kanban-board");
  };

  //JSX
  return (
    <>
      <nav className={showNavbar ? 'navbar-mobile' : 'navbar'}>

        <div className="navbar-content">

          <div className="logo">


            <GrTechnology size={40} color="white" />
            <h1 className="logo-title">Abstergo</h1>
          </div>

          <div className="navbar-items-container">

            <div className="navbar-items-title">


              <h3 className="navbar-items-title-text">All Boards ({boards.length})</h3>

              {loadingBoards ? (<MoonLoader color="white" className="navbar-menu-item" style={{ color: 'white' }} />) :
                <div className="navbar-menu-items">

                  {boards.map((board: SingleBoardType) => (



                    <div className={selectedBoard?._id == board?._id ? 'selected' : 'navbar-menu-item'}
                      key={board?._id} onClick={() => handleBoardClick(board)}

                    >


                      <FaClipboardList size={20} />
                      <h4 className="navbar-menu-item-text">{board.boardName}</h4>
                    </div>))}



                </div>}
              <div className="navbar-menu-item" onClick={() => {
                setOpenCreateBoardModal(!openCreateBoardModal)

                setCreateBoardClose(false)
              }}>


                <FaCalendarPlus size={20} className="board-icon" />
                <h4 className="navbar-menu-item-text">Create Board</h4>
              </div>
            </div>


            <div className="navbar-sign-out">


              <button className="signout-btn profile" onClick={handleTutorialClick}><IoMdHelp /><p>Tutorial</p></button>
              <button className="signout-btn" onClick={logoutUser}><FaSignOutAlt /><p>Sign Out</p></button>
            </div>
          </div>
        </div>
      </nav>



    </>
  )
}

export default Navbar