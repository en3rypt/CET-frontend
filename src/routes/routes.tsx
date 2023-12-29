import { RoutePaths } from "@/constants/enum";
import PrivateRoute, { PrivateHomeRoute } from "./privateRoute";
import { createBrowserRouter } from "react-router-dom";
import Login from "@/components/login";
import Register from "@/pages/register";
import ErrorPage from "@/pages/error";
import Home from "@/pages/home";
import Root from "./root";
import ProjectDetails from "@/pages/project";

const router = createBrowserRouter([
  {
    path: RoutePaths.LOGIN,
    element: (
      <PrivateHomeRoute>
        <Login />
      </PrivateHomeRoute>
    ),
  },
  {
    path: RoutePaths.REGISTER,
    element: (
      <PrivateHomeRoute>
        <Register />
      </PrivateHomeRoute>
    ),
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Root />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/project",
        element: <h1>projects</h1>,
      },
      {
        path: "/expense",
        element: <h1>projects</h1>,
      },
      {
        path: "/project/:projectId",
        element: <ProjectDetails />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);

export default router;
