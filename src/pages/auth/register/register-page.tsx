import React, { ReactElement, useEffect } from 'react';
import SplitScreen from '../../../components/split-screen';
import RegisterSteps from './register-steps';
import { useAuth } from '../../../context/auth-context';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage(): ReactElement {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user]);

    return (
        <SplitScreen
            imageLink="https://source.unsplash.com/1600x900/?croatia"
            title="Register your account"
        >
            <RegisterSteps />
        </SplitScreen>
    );
}
