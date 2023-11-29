import { HttpResponse } from "../../helper/HttpRequest";

enum Status {
    PENDING_AUTHENTICATION,
    AUTHENTICATED,
    UNAUTHENTICATED,
}

enum Role {
    DEVELOPER = 1,
    SUPER_ADMIN,
    ADMINISTRATOR,
    SUPER_DEVELOPER,
}

interface UserDetails {
    id: number;
    is_active: boolean;
    company_address: string;
    company_id: number;
    company_name: string;
    email: string;
    first_name?: string;
    last_name?: string;
    created_at: Date;
    phone: string;
    role_id: Role;
    username: string;
}

interface UserState {
    details: UserDetails | null;
    status: Status;
}

interface UserIntrospectResponse {
    user: UserDetails;
    active: boolean;
    scope: string;
    client_id: string;
    username: string;
    token_type: string;
    expires_in: number;
}

interface UserSlice {
    user: UserState;
    introspectToken: (
        token: string
    ) => Promise<void | HttpResponse<UserIntrospectResponse>>;
}

export { Status, Role };
export type { UserIntrospectResponse, UserDetails };
export default UserSlice;
