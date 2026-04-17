import { createBrowserRouter, Navigate } from "react-router";
import { Login } from "../pages/Login";
import { Dashboard } from "../pages/Dashboard";
import { CreateFeedback } from "../pages/CreateFeedback";
import { ProjectDetail } from "./components/ProjectDetail";
import { Welcome } from "./components/Welcome";
import { ErrorAnalysis } from "./components/ErrorAnalysis";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
    children: [
      { index: true, Component: Welcome },
      { path: "project/:projectId", Component: ProjectDetail },
      { path: "errors", Component: ErrorAnalysis },
    ],
  },
  {
    path: "/feedback",
    Component: CreateFeedback,
  },
]);