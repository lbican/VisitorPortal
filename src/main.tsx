import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/error/error-page';
import AdminPanel from './pages/root/admin-panel';
import Dashboard from './pages/dashboard/dashboard';
import Team from './pages/team/team';
import Properties from './pages/properties/properties';
import Calendar from './pages/calendar/calendar';
import LoginPage from './pages/auth/login/login-page';
import RegisterPage from './pages/auth/register/register-page';
import { ChakraProvider } from '@chakra-ui/react';
import themeConfig from './utils/theme/theme-config';
import { AuthContextProvider } from './context/auth-context';
import UserProfile from './pages/profile/user-profile';
import UsernamePage from './pages/auth/login/username-page';

const router = createBrowserRouter([
    {
        path: '/',
        errorElement: <ErrorPage />,
        element: <AdminPanel />,
        children: [
            {
                path: '/dashboard',
                element: <Dashboard />,
            },
            {
                path: '/team',
                element: <Team />,
            },
            {
                path: '/properties',
                element: <Properties />,
            },
            {
                path: '/calendar',
                element: <Calendar />,
            },
            {
                path: '/user/:userId',
                element: <UserProfile />,
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
