// frontend/src/main.jsx
// Application entry point. Mounts the React tree into #root.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider }    from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';
import App                 from './App.jsx';

import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SidebarProvider>
          <App />
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#1e293b',
                fontSize: '14px',
                borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                border: '1px solid #e2e8f0',
                maxWidth: '380px',
              },
              success: {
                iconTheme: { primary: '#1a6b4a', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#dc2626', secondary: '#fff' },
              },
              loading: {
                iconTheme: { primary: '#1a6b4a', secondary: '#fff' },
              },
            }}
          />
        </SidebarProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
