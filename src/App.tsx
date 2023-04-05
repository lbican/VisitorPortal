import React, { ReactElement } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AdminPanel from './pages/root/admin-panel';
import themeConfig from './utils/theme/theme-config';
import LoginPage from './pages/auth/login/login-page';
import ErrorPage from './pages/error/error-page';
import RegisterPage from './pages/auth/register/register-page';
import Dashboard from './pages/dashboard/dashboard';
import Team from './pages/team/team';
import Calendar from './pages/calendar/calendar';
import Properties from './pages/properties/properties';
import { AuthContextProvider } from './context/auth-context';

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
    ],
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'register',
    element: <RegisterPage />,
  },
]);

function App(): ReactElement {
  return (
    <ChakraProvider theme={themeConfig}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </ChakraProvider>
  );
}

export default App;
