import React, { ReactElement, useEffect } from 'react';
import SplitScreen from '../../../components/layout/split-screen';
import LoginForm from './login-form';
import { useAuth } from '../../../context/auth-context';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function LoginPage(): ReactElement {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    useEffect(() => {
        if (user?.username) {
            const redirectTo = location.state?.from || '/';
            navigate(redirectTo, {
                replace: true,
            });
        }
    }, [user]);

    return (
        <SplitScreen
            imageLink="https://source.unsplash.com/1600x900/?croatia"
            title={t('Login to your account')}
        >
            <LoginForm />
        </SplitScreen>
    );
}
