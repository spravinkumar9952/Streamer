export interface User {
    email: string;
}

export interface SuccessResp {
    message: string;
}

export interface ErrorResp {
    message: string;
    description?: string;
}
