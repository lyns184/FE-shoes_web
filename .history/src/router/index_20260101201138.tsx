import { RouteObject } from 'react-router-dom';
import Home from '../pages/Home';
import SignUp from '../pages/SignUp';
import ProductDetail from '../pages/ProductDetail';
import NotFound from '../pages/NotFound';

export const routes: RouteObject[] = [
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
    path: '*',
    element: <NotFound />,
  },
];
