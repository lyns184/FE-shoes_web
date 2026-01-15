// ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import checkLogin from '../utlis/checkLogin';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Nếu người dùng đã login, redirect về trang home
  if (checkLogin()) {
    return <Navigate to="/" replace />;
  }

  // Nếu chưa login, cho phép truy cập
  return children;
}
