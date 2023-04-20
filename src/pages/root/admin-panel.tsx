import React, { ReactElement, useEffect } from 'react';
import Sidebar from '../../components/layout/sidebar';
import { Outlet } from 'react-router';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
const AdminPanel = (): ReactElement => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            navigate('/login');
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
