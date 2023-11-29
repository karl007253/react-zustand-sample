import { useEffect } from "react";
import useStore from "../zustand/Store";
import { Status } from "../zustand/interface/UserInterface";
import { getCookies } from "../helper/Cookies";
import { API_TOKEN } from "../data/Constant";

/**
 * Retrieve user details during a session refresh
 */
const useSessionRefresh = () => {
    const { status, introspectToken } = useStore((state) => ({
        status: state.user.status,
        introspectToken: state.introspectToken,
    }));

    useEffect(() => {
        // Only attempt to retrieve user details when the authentication status has not yet been checked
        if (status === Status.PENDING_AUTHENTICATION) {
            // Get token from cookies
            const token = getCookies(API_TOKEN);

            introspectToken(token);
        }
    }, []);
};

export default useSessionRefresh;
