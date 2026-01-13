import { GoogleLogin } from '@react-oauth/google';
import { googleLogin } from '../../services/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface SocialLoginProps {
  mode?: 'signup' | 'login';
}

export default function SocialLogin({ mode = 'signup' }: SocialLoginProps) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      setError('Failed to get Google credential');
      return;
    }

    try {
      const result = await googleLogin(credentialResponse.credential);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Google login failed');
      }
    } catch (err) {
      setError('An error occurred during Google login');
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed');
  };

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

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            theme="outline"
            size="large"
            text={mode === 'signup' ? 'signup_with' : 'signin_with'}
          />
        </div>
      </div>
    </>
  );
}
