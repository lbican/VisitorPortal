import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/error/error-page';
import AdminPanel from './pages/root/admin-panel';
import Dashboard from './pages/dashboard/dashboard';
import Reservations from './pages/reservations/reservations';
import Properties from './pages/properties/properties';
import CalendarPage from './pages/calendar/calendar-page';
import LoginPage from './pages/auth/login/login-page';
import RegisterPage from './pages/auth/register/register-page';
import { ChakraProvider } from '@chakra-ui/react';
import themeConfig from './utils/theme/theme-config';
import { AuthContextProvider } from './context/auth-context';
import ProfilePage from './pages/profile/profile-page';
import UsernamePage from './pages/auth/login/username-page';
import PropertyPage from './pages/properties/property-page';
import './i18n/config';

const router = createBrowserRouter([
    {
        path: '/',
        errorElement: <ErrorPage />,
        element: <AdminPanel />,
        children: [
            {
                path: '/',
                element: <Dashboard />,
            },
            {
                path: '/reservations',
                element: <Reservations />,
            },
            {
                path: '/properties',
                element: <Properties />,
            },
            {
                path: '/properties/property/:pid',
                element: <PropertyPage />,
            },
            {
                path: '/calendar',
                element: <CalendarPage />,
            },
            {
                path: '/user/:username',
                element: <ProfilePage />,
            },
        ],
    },
    {
        path: 'login',
        element: <LoginPage />,
    },
    {
        path: 'finish',
        element: <UsernamePage />,
    },
    {
        path: 'register',
        element: <RegisterPage />,
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ChakraProvider theme={themeConfig}>
            <AuthContextProvider>
                <RouterProvider router={router} />
            </AuthContextProvider>
        </ChakraProvider>
    </React.StrictMode>
);
