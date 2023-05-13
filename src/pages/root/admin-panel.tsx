import React, { ReactElement, useEffect } from 'react';
import Sidebar from '../../components/layout/sidebar';
import { Outlet } from 'react-router';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { useAuth } from '../../context/auth-context';
import { useLocation, useNavigate } from 'react-router-dom';
const AdminPanel = (): ReactElement => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!user) {
            navigate('/login', {
                replace: true,
                state: { from: location.pathname },
            });
        }

        if (user && !user.username) {
            navigate('/finish', {
                replace: true,
                state: { from: location.pathname },
            });
        }
    }, [user]);

    return (
        <Sidebar>
            <Box
                flex="1"
                bg={useColorModeValue('gray.50', 'gray.700')}
                padding="4"
                roundedTopLeft="md"
                shadow="sm"
            >
                <Outlet />
            </Box>
        </Sidebar>
    );
};

export default AdminPanel;
