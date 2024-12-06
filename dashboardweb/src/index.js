import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppRouter from './router/Router';
import { UserProvider } from '../src/context/userContext';
import 'bootstrap/dist/css/bootstrap.min.css';


const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <AppRouter />
    </UserProvider>
  </React.StrictMode>
);
