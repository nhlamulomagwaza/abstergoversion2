//IMPORTS

import Navbar from "./components/navbar/Navbar";
import Belt from "./components/belt/Belt";
import Signup from "./components/auth/Signin";
import { Toaster } from "react-hot-toast";
import { useContext, useEffect, useState } from "react";
import CreateBoard from "./components/boards/createboard/CreateBoard";
import BoardCanvas from "./components/boardCanvas/BoardCanvas";
import { AbstergoAuthContext, AuthContextTypes } from "./store/AuthContext";
import {
  AbstergoModalsContext,
  ModalsContextTypes,
} from "./store/ModalsContext";
import CreateCard from "./components/boards/createcards/CreateCard";
import {
  AbstergoBoardContext,
  BoardsContextTypes,
} from "./store/BoardsContext";
import Task from "./components/boards/tasks/Task";
import EditTask from "./components/boards/edittasks/EditTask";
import EditBoard from "./components/boards/editboard/EditBoard";
import Null from "./components/null/Null";
import { useWindowSize } from "react-use";
import LoadingColumns from "./components/null/LoadingColumns";
import { AbstergoGeneralContext } from "./store/GeneralContext";
import NoBoard from "./components/null/NoBoard";
import SplashScreen from "./components/splashscreen/SplashScreen";

function App(): React.ReactNode {
  const [isLoading, setIsLoading] = useState(true);
  const [showSplashScreen, setShowSplashScreen] = useState(false);
  const { width } = useWindowSize();

  useEffect(() => {
    if (width > 760) {
      setShowNavbar(false);
    }
  }, [width]);


  useEffect(() => {
    const hasSeenSplashScreen = localStorage.getItem("hasSeenSplashScreen");
    if (!hasSeenSplashScreen) {
      setShowSplashScreen(true);
      localStorage.setItem("hasSeenSplashScreen", "true");
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading && showSplashScreen) {
    return <SplashScreen />;
  }

 

  //VARIABLES
  const { authUser } = useContext(AbstergoAuthContext) as AuthContextTypes;
  const { selectedBoard, boardColumns, loadingColumns, boards } = useContext(
    AbstergoBoardContext
  ) as BoardsContextTypes;
  const {
    openCreateBoardModal,
    openCreateCardModal,
    openSingleTaskModal,
    openEditTaskModal,
    openEditBoardModal,
    setOpenEditBoardModal,
  } = useContext(AbstergoModalsContext) as ModalsContextTypes;

  const { showNavbar, setShowNavbar } = useContext(AbstergoGeneralContext);
  return (
    <>
      {authUser ? (
        <>
          <Navbar />
          <Belt />
          <BoardCanvas />

          {boardColumns?.length == 0 && selectedBoard ? <Null /> : null}

          {selectedBoard && loadingColumns ? <LoadingColumns /> : null}

          {authUser && boards.length == 0 ? <NoBoard /> : null}

          {openCreateBoardModal ? <CreateBoard /> : null}

          {openEditBoardModal && selectedBoard ? <EditBoard /> : null}

          {openCreateCardModal && selectedBoard ? <CreateCard /> : null}

          {openSingleTaskModal && selectedBoard ? <Task /> : null}

          {openEditTaskModal && selectedBoard ? <EditTask /> : null}
        </>
      ) : (
        <Signup />
      )}
      <button
        className={authUser ? "mobile-menu-reveal" : "mobile-menu-none"}
        onClick={() => setShowNavbar(!showNavbar)}
        style={
          showNavbar
            ? {
                backgroundColor: "#2672c3",
                color: "white",
                border: "1px solid aqua",
              }
            : {}
        }
      >
        {showNavbar ? "Close" : "Menu"}
      </button>
      <Toaster />
    </>
  );
}

export default App;
