import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { router } from './router'
import { CartProvider } from './hooks/useCart'
import { UserProvider } from './hooks/UserContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import 'nprogress/nprogress.css'
import './App.css'

// Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1057892063257-g05e24h4tmcj0p0vq21egeb5pnbqkb6v.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <UserProvider>
        <CartProvider>
          <RouterProvider router={router} />
          <Toaster position="top-center" />
        </CartProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  )
}

export default App
