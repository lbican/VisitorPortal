import React, { ReactElement, useEffect } from 'react';
import SplitScreen from '../../../components/common/split-screen';
import LoginForm from './login-form';
import { useAuth } from '../../../context/auth-context';
import { useLocation, useNavigate } from 'react-router-dom';

export default function LoginPage(): ReactElement {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user && user.username) {
            const redirectTo = location.state?.from || '/';
            navigate(redirectTo, {
                replace: true,
            });
        }
    }, [user]);

    return (
        <SplitScreen
            imageLink="https://source.unsplash.com/1600x900/?croatia"
            title="Login to your account"
        >
            <LoginForm />
        </SplitScreen>
    );
}
