import React, { ReactElement } from 'react';
import SplitScreen from '../../../components/split-screen';
import LoginForm from './login-form';

export default function LoginPage(): ReactElement {
  return (
    <SplitScreen
      imageLink={'https://source.unsplash.com/1600x900/?croatia'}
      title={'Login to your account'}
    >
      <LoginForm />
    </SplitScreen>
  );
}
