import { createBrowserRouter, Outlet, useLocation } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { useEffect } from 'react';
import NProgress from 'nprogress';
import Home from '../pages/Home';
import SignUp from '../pages/SignUp';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Search from '../pages/Search';
import Profile from '../pages/Profile';
import Admin from '../pages/Admin';
import NotFound from '../pages/NotFound';
import AdminProducts from '../pages/Admin/pages/Products';
import AdminOrder from '../pages/Admin/pages/Orders';
import AdminUser from '../pages/Admin/pages/Users';

NProgress.configure({ 
  showSpinner: false,
  speed: 400,
  minimum: 0.2
});

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    NProgress.start();
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);
    
    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname]);
  
  return <Outlet />;
}

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <SignUp />,
  },
  {
    path: '/product/:id',
    element: <ProductDetail />,
  },
  {
    path: '/cart',
    element: <Cart />,
  },
  {
    path: '/checkout',
    element: <Checkout />,
  },
  {
    path: '/search',
    element: <Search />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/admin',
    element: <Admin />,
    children: [
      {
        path: 'products',
        element: <AdminProducts />,
      },
      {
        path: 'orders',
        element: <AdminOrder/>
      },
      {
        path: 'users',
        element: <AdminUser/>
      }
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export const router = createBrowserRouter([
  {
    element: <ScrollToTop />,
    children: routes,
  },
]);
