import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/MainLayout";
import { ProjectDetail } from "./components/ProjectDetail";
import { Welcome } from "./components/Welcome";
import { ErrorAnalysis } from "./components/ErrorAnalysis";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Welcome },
      { path: "project/:projectId", Component: ProjectDetail },
      { path: "errors", Component: ErrorAnalysis },
    ],
  },
]);
