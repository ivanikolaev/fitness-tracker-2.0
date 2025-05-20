// User role enum
export enum UserRole {
    USER = 'user',
    TRAINER = 'trainer',
    ADMIN = 'admin',
}

// User interface
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    profilePicture?: string;
    height?: number;
    weight?: number;
    dateOfBirth?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}