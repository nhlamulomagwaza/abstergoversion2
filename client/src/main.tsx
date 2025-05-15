
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AuthContext from "./store/AuthContext.js";
import BoardsContext from "./store/BoardsContext.tsx";
import ModalsContext from "./store/ModalsContext.tsx";
import CardsContext from "./store/CardsContext.tsx";
import TasksContext from "./store/TasksContext.tsx";
import GeneralContext from "./store/GeneralContext.tsx";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContext>
        <BoardsContext>
          <CardsContext>
            <ModalsContext>
              <TasksContext>
                <GeneralContext>
                  <App />
                </GeneralContext>
              </TasksContext>
            </ModalsContext>
          </CardsContext>
        </BoardsContext>
      </AuthContext>
    </BrowserRouter>
  </React.StrictMode>
);
