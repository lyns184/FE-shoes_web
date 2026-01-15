import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { router } from './router'
import { UserProvider } from './hooks/UserContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './lib/queryClient'
import { BuyNowProvider } from './hooks/useBuyNow'
import 'nprogress/nprogress.css'
import './App.css'

// Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1057892063257-g05e24h4tmcj0p0vq21egeb5pnbqkb6v.apps.googleusercontent.com';

function App() {
  try {
    return (
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" reverseOrder={false} />
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <UserProvider>
            <BuyNowProvider>
              <RouterProvider router={router} />
            </BuyNowProvider>
          </UserProvider>
        </GoogleOAuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    )
  } catch (error) {
    console.error('App Error:', error);
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Error loading app</h1>
        <pre>{String(error)}</pre>
      </div>
    );
  }
}

export default App
