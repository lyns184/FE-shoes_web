import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { googleLogin } from '../../services/auth';
import toast from 'react-hot-toast';
import Token from '../../utlis/Token';
import { FcGoogle } from 'react-icons/fc'; // icon Google màu chuẩn

interface SocialLoginProps {
  mode?: 'signup' | 'login';
}

export default function SocialLogin({ mode = 'signup' }: SocialLoginProps) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      console.log(tokenResponse)
      const toastID = toast.loading('Signing...')
      const responseData = await googleLogin(tokenResponse.code) 
      if (responseData.success) 
      {
        const {accessToken , resfreshToken} = responseData 
        Token.setToken('accessToken' , accessToken) 
        Token.setToken('resfreshToken' , resfreshToken) 
        //Chuyen huong ve nguoi dung 
        toast.success(responseData.message || "Login successful" , {id : toastID })
        navigate('/') 
      }
      else toast.error('Login failed. Please try again') 


    },
    onError: () => {
      setError('Google login failed');
      toast.error('Login failed. Please try again') 
    },
    flow: 'auth-code', // hoac 'auth-code' neu muon
  });

  return (
    <>
      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Or</span>
        </div>
      </div>

      {/* Social Login */}
      <div className="text-center">
        <p className="text-sm text-gray-700 mb-4 font-bold">
          {mode === 'signup' ? 'Sign up with' : 'Log in with'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <button
          onClick={() => loginWithGoogle()}
          disabled={loading}
          className="flex items-center mx-auto justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition text-sm font-medium"
        >
          <FcGoogle size={20} />
          {mode === 'signup' ? 'Sign up with Google' : 'Log in with Google'}
        </button>
      </div>
    </>
  );
}
