import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoutes = ({ element: Element, roles, ...rest }) => {
    const { user } = useAuth();
    const location = useLocation();
    if (!user.token) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/404" state={{ from: location }} />;
    }

    return Element;
};

export default ProtectedRoutes;
