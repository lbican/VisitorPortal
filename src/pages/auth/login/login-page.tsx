import React, { ReactElement } from 'react';
import SplitScreen from '../../../components/split-screen';
import LoginForm from './login-form';
import { useAuth } from '../../../context/auth-context';
import { useNavigate } from 'react-router-dom';

export default function LoginPage(): ReactElement {
    const { user } = useAuth();
    const navigate = useNavigate();
    if (user) {
        navigate('/');
    }

    return (
        <SplitScreen
            imageLink={'https://source.unsplash.com/1600x900/?croatia'}
            title={'Login to your account'}
        >
            <LoginForm />
        </SplitScreen>
    );
}
