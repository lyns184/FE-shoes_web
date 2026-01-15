import { successMessage , errorMessage } from "../utlis/serverMessage";
const API_BASE_URL = 'http://localhost:6869/api';

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



export function logout(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export function checkAuth(): boolean {
  const token = localStorage.getItem('accessToken');
  return token !== null;
}

export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken');
}

export function getRefreshToken(): string | null {
  return localStorage.getItem('refreshToken');
}

export async function googleLogin(code : string) //: Promise<AuthResponse> 
{
  try 
  { 
    const responseData = await api.post('/api/auth/login-google' , {
      code 
    }) 
    console.log('>>> Thogn tin dang nhap bang google: ' , responseData.data) 
    return responseData.data 
  } 
  catch (err : any) 
  {
    const serverMessage = errorMessage(err) 
    throw new Error(serverMessage)
  }
}