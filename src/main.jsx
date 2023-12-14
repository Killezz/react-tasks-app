import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Tasks from "./routes/Tasks";
import Header from "./components/Header";
import FinishedTasks from "./routes/FinishedTasks";
import Info from "./routes/Info";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />
        <Tasks />
      </>
    ),
  },
  {
    path: "/finished-tasks",
    element: (
      <>
        <Header />
        <FinishedTasks />
      </>
    ),
  },
  {
    path: "/info",
    element: (
      <>
        <Header />
        <Info />
      </>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
