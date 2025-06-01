export class UserNotFoundError extends Error {
    constructor(email: string) {
        super(`User not found with email ${email}`);
    }
}

export class UserAlreadyExistsError extends Error {
    constructor(email: string) {
        super(`User already exists with email ${email}`);
    }
}

export class UserNotFriendError extends Error {
    constructor(email: string) {
        super(`User ${email} is not a friend`);
    }
}
