import React, { ReactElement, useEffect } from 'react';
import Sidebar from '../../components/layout/sidebar';
import { Outlet } from 'react-router';
import { Flex, Spinner } from '@chakra-ui/react';
import { useAuth } from '../../context/auth-context';
import { useLocation, useNavigate } from 'react-router-dom';
import ContentWrapper from '../../components/layout/content-wrapper';
const AdminPanel = (): ReactElement => {
    const { user, loadingUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!user && !loadingUser) {
            navigate('/login', {
                replace: true,
                state: { from: location.pathname },
            });
        }

        if (!loadingUser && user && !user.username) {
            navigate('/finish', {
                replace: true,
                state: { from: location.pathname },
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
        <Sidebar>
            <ContentWrapper>
                <Outlet />
            </ContentWrapper>
        </Sidebar>
    );
};

export default AdminPanel;
