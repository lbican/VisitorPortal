import React, { ReactElement, useEffect } from 'react';
import SplitScreen from '../../../components/layout/split-screen';
import RegisterSteps from './register-steps';
import { useAuth } from '../../../context/auth-context';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import getRandomImage from '../../../utils/image';

export default function RegisterPage(): ReactElement {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    useEffect(() => {
        if (user?.username) {
            const redirectTo = location.state?.from ?? '/';
            navigate(redirectTo, {
                replace: true,
            });
        }
    }, [user]);

    return (
        <SplitScreen imageLink={getRandomImage} title={t('Register your account')}>
            <RegisterSteps />
        </SplitScreen>
    );
}
