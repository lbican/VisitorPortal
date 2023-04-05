import React, { ReactElement } from 'react';
import SplitScreen from '../../../components/split-screen';
import RegisterForm from './register-form';

export default function RegisterPage(): ReactElement {
    return (
        <SplitScreen
            imageLink={'https://source.unsplash.com/1600x900/?croatia'}
            title={'Register your account'}
        >
            <RegisterForm />
        </SplitScreen>
    );
}
