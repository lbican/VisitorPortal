import React, { ReactElement, useEffect } from 'react';
import SplitScreen from '../../../components/layout/split-screen';
import LoginForm from './login-form';
import { useAuth } from '../../../context/auth-context';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Flex, Spinner } from '@chakra-ui/react';

export default function LoginPage(): ReactElement {
    const { user, loadingUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    useEffect(() => {
        if (user?.username && !loadingUser) {
            const redirectTo = location.state?.from || '/';
            navigate(redirectTo, {
                replace: true,
            });
        }
    }, [user, loadingUser]);

    if (loadingUser) {
        return (
            <Flex justifyContent="center" alignItems="center" height="100vh">
                <Spinner size="xl" />
            </Flex>
        );
    }

    return (
        <SplitScreen
            imageLink="https://source.unsplash.com/1600x900/?croatia"
            title={t('Login to your account')}
        >
            <LoginForm />
        </SplitScreen>
    );
}
