import { Outlet } from "react-router-dom";
import useStore from "../zustand/Store";
import { Status } from "../zustand/interface/UserInterface";
import useSessionRefresh from "../hooks/SessionRefresh";
import redirectToLogin from "../helper/Redirect";

/**
 * Route component for the purpose of securing pages that are only accessible to authenticated users
 */
const ProtectedRoute = () => {
    const status = useStore((state) => state.user.status);

    // Attempt to retrieve user details and update user state
    useSessionRefresh();

    // TODO: Implement loading component
    // // Show a loading component if checking of authentication status is still ongoing
    // if (status === Status.PENDING_AUTHENTICATION) {
    //     return <PageLoader />;
    // }

    // Redirect to login page if the user is unauthenticated
    if (status === Status.UNAUTHENTICATED) {
        redirectToLogin();
    }

    // By default, redirect to the requested page if the user is authenticated
    return <Outlet />;
};

export default ProtectedRoute;
