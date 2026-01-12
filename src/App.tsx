import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { CartProvider } from './hooks/useCart'
import { UserProvider } from './hooks/UserContext'
import 'nprogress/nprogress.css'
import './App.css'

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </UserProvider>
  )
}

export default App
