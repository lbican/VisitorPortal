export interface UserRegistration {
    username: string;
    first_name: string;
    last_name: string;
    avatar: string;
    email: string;
    password: string;
    repeat_password: string;
}

export interface User extends Omit<UserRegistration, 'password' | 'repeat_password'> {
    token: string;
}
