import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { routes } from './router'
import { CartProvider } from './hooks/useCart'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import './App.css'

// Configure NProgress
NProgress.configure({ 
  showSpinner: false,
  speed: 400,
  minimum: 0.2
});

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Start progress bar
    NProgress.start();
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Complete progress bar after a short delay
    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);
    
    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname]);
  
  return null;
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
