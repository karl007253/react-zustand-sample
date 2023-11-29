import { StateCreator } from "zustand";
import httpRequest, { HttpResponse } from "../../helper/HttpRequest";

import UserSlice, {
    Status,
    UserIntrospectResponse,
} from "../interface/UserInterface";

const createUserSlice: StateCreator<
    UserSlice,
    [["zustand/devtools", never]]
> = (setState) => ({
    user: {
        details: null,
        status: Status.PENDING_AUTHENTICATION,
    },

    introspectToken: async (token) => {
        const data = {
            token,
            token_type_hint: "access_token",
        };

        return httpRequest
            .post<void, HttpResponse<UserIntrospectResponse>>(
                "v1/oauth/tokens/introspect",
                data
            )
            .then((result) => {
                // Set status to authenticated if the user details have been successfully retrieved
                setState(
                    {
                        user: {
                            details: result.data.user,
                            status: Status.AUTHENTICATED,
                        },
                    },
                    false,
                    "introspect"
                );

                return result;
            })
            .catch(() => {
                // Set status to unauthenticated if the user details cannot be retrieved
                setState(
                    {
                        user: {
                            details: null,
                            status: Status.UNAUTHENTICATED,
                        },
                    },
                    false,
                    "introspect"
                );
            });
    },
});

export default createUserSlice;
