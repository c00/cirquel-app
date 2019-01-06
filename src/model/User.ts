export interface User {
    id: number;
    email: string;
    created: number;
    lastLogin: number;
    active: boolean;
    session: Session;
    userName: string;
    imgBase: string;

    firstName?: string;
    lastName?: string;
    role?: string;
    stub?: string;
    enablePush?: boolean;
}

export interface Session {
    token: string;
    created: number;
    expires: number;
    lastAccess: number;
    
    userId?: number;
}

export abstract class UserRole {
    static ADMIN = 'admin';
	static USER = 'user';
}