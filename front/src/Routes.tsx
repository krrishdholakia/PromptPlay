import { RouterProvider } from "react-router-dom";
import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import RouteSpace from "./component-common/route_space/RouteSpace";
import RouteFlow from "./route-flow/RouteFlow";
import Header from "./route-root/Header";
import RootRoute from "./route-root/RootRoute";
import {
  ROOT_PATH,
  SPACES_FLOW_PATH_PATTERN,
  SPACE_PATH_PATTERN,
} from "./static/routeConfigs";

const router = createBrowserRouter([
  {
    path: ROOT_PATH,
    element: (
      <div className="App">
        <Header />
        <Outlet />
      </div>
    ),
    children: [
      {
        path: "/",
        element: <RootRoute />,
      },
      {
        path: SPACE_PATH_PATTERN,
        element: <RouteSpace />,
      },
      {
        path: SPACES_FLOW_PATH_PATTERN,
        element: <RouteFlow />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}