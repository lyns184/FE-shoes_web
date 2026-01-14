import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { CartProvider } from './hooks/useCart'
import { UserProvider } from './hooks/UserContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import 'nprogress/nprogress.css'
import './App.css'

// Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1057892063257-g05e24h4tmcj0p0vq21egeb5pnbqkb6v.apps.googleusercontent.com';

function App() {
  try {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <UserProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </UserProvider>
      </GoogleOAuthProvider>
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
