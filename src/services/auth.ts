import { successMessage , errorMessage } from "../utlis/serverMessage";
const API_BASE_URL = 'http://localhost:6869/api';
import Token from '../utlis/Token';

import api from "../api/axios";
interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
}
export async function register(data: RegisterData)  //: Promise<AuthResponse> 
{
  try 
  {
    const responseData = await api.post('/api/auth/register' , data) 
    return responseData.data
  } 
  catch (err) 
  {
    const serverMessage = errorMessage(err) //Nhan vao error va trich xuat ra message tu error    
    throw new Error(serverMessage || 'Register failed');
  }
}
export async function login(data: LoginData) //: Promise<AuthResponse> 
{
  try 
  {
    const responseData = await api.post('/api/auth/login' , data) 
    return responseData.data 
  } 
  catch (err) 
  {
    const serverMessage = errorMessage(err) 
    throw new Error(serverMessage)
  }
}
export async function verifyEmail(token: string)//: Promise<AuthResponse> 
{
  //Ham dung de verify email 
  try 
  {
    const responseData = await api.get(`/api/auth/verify?token=${token}`) 
    return responseData.data
  } 
  catch (err : any) 
  {
    const serverMessage = errorMessage(err) 
    throw new Error(serverMessage)
  } 
}



export async function logout(): Promise<void> {
  try {
    // Gọi API logout để server xóa refresh token
    await api.post('/api/auth/logout');
  } catch (error) {
    // Logout API failed, clearing tokens anyway
  } finally {
    // Xóa token phía client
    Token.clearAllTokens();
    
    // Chuyển hướng về trang login
    window.location.href = '/login';
  }
}

export function checkAuth(): boolean {
  const token = Token.getAccessToken();
  return token !== null && token !== undefined;
}

export function getAccessToken(): string | null {
  return Token.getAccessToken() || null;
}

export function getRefreshToken(): string | null {
  return Token.getRefreshToken() || null;
}

export async function refreshAccessToken(): Promise<string | null> {
  try {
    // API refresh-token sẽ đọc refreshToken từ httpOnly cookie
    const response = await api.get('/api/auth/refresh-token');
    
    if (response.data.success && response.data.accessToken) {
      const newAccessToken = response.data.accessToken;
      Token.setAccessToken(newAccessToken);
      return newAccessToken;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

export async function googleLogin(code : string) //: Promise<AuthResponse> 
{
  try 
  { 
    const responseData = await api.post('/api/auth/login-google' , {
      code 
    }) 
    return responseData.data 
  } 
  catch (err : any) 
  {
    const serverMessage = errorMessage(err) 
    throw new Error(serverMessage)
  }
}