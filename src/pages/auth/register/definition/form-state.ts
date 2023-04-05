export interface StepActions {
    nextStep: () => void;
    prevStep?: () => void;
}

export const FORM_STATE = {
    selectedIndex: 0,
    steps: {
        account: {
            valid: false,
            value: {
                username: '',
                first_name: '',
                last_name: '',
                avatar: '',
            },
        },
        security: {
            valid: false,
            value: {
                email: '',
                password: '',
                repeat_password: '',
            },
        },
    },
};
