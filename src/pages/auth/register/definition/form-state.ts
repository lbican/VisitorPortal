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
        first_name: '',
        last_name: '',
        avatar: '',
        email: '',
        password: '',
        repeat_password: '',
      },
    },
    security: {
      valid: false,
      value: {
        country: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
      },
    },
  },
};
