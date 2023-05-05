import { UseFormWatch } from 'react-hook-form';

interface AuthFieldValues {
    email: string;
    password: string;
    repeat_password: string;
}

export const passwordValidator = {
    required: 'Password is required',
};

export const repeatPasswordValidator = (watch: UseFormWatch<AuthFieldValues>) => {
    return {
        required: 'You need to repeat the password',
        validate: (val: string) => {
            if (watch('password') != val) {
                return 'Your passwords do no match';
            }
        },
    };
};

export const emailValidator = {
    required: 'Email is required',
};

export const firstNameValidator = {
    required: 'First name is required',
};

export const lastNameValidator = {
    required: 'Last name is required',
};

export const usernameValidator = {
    required: 'Username is required',
};
