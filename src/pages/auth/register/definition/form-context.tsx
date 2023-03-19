import React, { createContext, ReactNode, useMemo, useState } from 'react';
import { FORM_STATE } from './form-state';
interface FormContextValue {
  formState: typeof FORM_STATE;
  setFormState: React.Dispatch<React.SetStateAction<typeof FORM_STATE>>;
}

export const FormContext = createContext<FormContextValue | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formState, setFormState] = useState(FORM_STATE);

  const contextValue = useMemo(() => {
    return { formState, setFormState };
  }, [formState, setFormState]);

  return <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>;
};
