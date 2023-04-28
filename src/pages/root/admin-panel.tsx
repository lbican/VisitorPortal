import React, { ReactElement } from 'react';
import Sidebar from '../../components/layout/sidebar';
import { Outlet } from 'react-router';
import { Box, useColorModeValue } from '@chakra-ui/react';
const AdminPanel = (): ReactElement => {
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
