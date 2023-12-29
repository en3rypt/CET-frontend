import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/utils";
import { RoutePaths } from "../constants/enum";

const PrivateRoute = ({ children }: { children: JSX.Element }): JSX.Element => {
  return isAuthenticated() ? children : <Navigate to={RoutePaths.LOGIN} />;
};

export default PrivateRoute;

export const PrivateHomeRoute = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  return !isAuthenticated() ? children : <Navigate to={RoutePaths.DASHBOARD} />;
};
