import { Outlet } from "react-router-dom";
import useAppDataRefresh from "../hooks/AppDataRefresh";

/**
 * Route component for the purpose keeping application details up to date
 */
const MainRoute = () => {
    // Retrieve app details
    useAppDataRefresh();

    // Redirection
    return <Outlet />;
};

export default MainRoute;
