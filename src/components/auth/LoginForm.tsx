import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login , verifyEmail } from '../../services/auth';   //Chinh sua laii ham nay 
import { getSearchQuery } from '../../utlis/getQuery';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { errorMessage , successMessage } from '../../utlis/serverMessage';
import Token from '../../utlis/Token';
import toast from 'react-hot-toast';
export default function LoginForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const { 
    mutateAsync: loginMutate, 
    isPending: loginPending 
  } = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      return await login(data);
    },
    onSuccess: (data) => {
      if (data.success) {
        const { accessToken } = data;
        // Chỉ lưu accessToken, refreshToken sẽ được server set qua httpOnly cookie
        Token.setAccessToken(accessToken);
        
        // Invalidate và refetch tất cả user-related queries
        queryClient.invalidateQueries({ queryKey: ['user'] });
        queryClient.invalidateQueries({ queryKey: ['auth'] });
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        
        toast.success(successMessage(data));
        setFormData({ email: '', password: '' }); // reset form
        
        // Navigate to home page after successful login
        navigate('/');
      } else {
        toast.error(data.message || 'Login failed');
      }
    },
    onError: (err: any) => {
      toast.error(errorMessage(err) || 'Login error');
    }, 
    retry: 0 
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const toastID = toast.loading('Signing in...');
    
    try {
      await loginMutate(formData);
    } finally {
      toast.dismiss(toastID);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  //--------------------------------------FORGOTPASSWORD -------------------------------------------
  const { mutateAsync: resetPasswordMutate, isPending: resetPasswordPending } = useMutation({
    mutationFn: async (email: string) => {
      return { success: true, message: 'Reset link sent to email' };
    },
  });

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastID = toast.loading('Sending reset email...');

    try {
      const result = await resetPasswordMutate(resetEmail);
      if (result.success) {
        setResetSuccess(true);
        toast.success(result.message || 'Reset email sent', { id: toastID });
      } else {
        toast.error(result.message || 'Failed to send reset email', { id: toastID });
      }
    } catch (err: any) {
      toast.error(err?.message || 'Reset email error', { id: toastID });
    }
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
    setResetEmail('');
    setResetSuccess(false);
  };
  //---------------------------VERIFY ACCOUNT --------------------------------------
  
  const token = getSearchQuery('token');

  const { mutateAsync: verifyMutate , isPending : verifyPending } = useMutation({
    mutationFn: async (token: string) => {
      const responseData = await verifyEmail(token);
      return responseData;
    },
    onSuccess: (data) => {
      toast.success(successMessage(data) || "Verify successfully"); 
      navigate('/login');
    },
    onError: (err: any) => {
      toast.error(err?.message || "Verify failed");
    }, 
    retry: 0 
  });
  
  useEffect(() => {
    if (!token) return;
  
    const toastID = toast.loading('Verifying account...');
  
    verifyMutate(token).catch(() => {
      // Không cần làm gì, onError đã handle toast
    }).finally(() => {
        toast.dismiss(toastID); // chỉ remove loading toast, không ảnh hưởng success/error
      });
  
  }, [token, verifyMutate]);
  
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email Address*"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-400"
          required
          disabled={loginPending || verifyPending}
        />

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password*"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-400"
            required
            disabled={loginPending || verifyPending}
          />
          <div className="flex justify-end mt-2">
            <button 
              type="button" 
              onClick={() => setShowForgotPasswordModal(true)}
              className="text-xs text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
            >
              <span className="font-bold">Forgot password?</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-600 pt-2 text-center font-bold">
          By logging in you agree to the <span className="font-bold">Terms</span> and <span className="font-bold">Privacy</span>
        </p>

        <button
          type="submit"
          disabled={loginPending || verifyPending}
          className="w-full bg-[#396254] hover:bg-[#2d4d3f] text-white py-3 rounded-sm font-medium text-base transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {(loginPending) ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative">
            <button
              type="button"
              onClick={closeForgotPasswordModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="p-6">
              {!resetSuccess ? (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Reset Password</h2>
                  <p className="text-gray-600 text-sm mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>

                  <form onSubmit={handleForgotPasswordSubmit}>
                    <div className="mb-4">
                      <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        id="resetEmail"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="Enter Your Email"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#396254] focus:border-transparent"
                        required
                        disabled={resetPasswordPending}
                      />
                    </div>

                    <div className="flex gap-3 justify-end">
                      <button
                        type="button"
                        onClick={closeForgotPasswordModal}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                        disabled={resetPasswordPending}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={resetPasswordPending || !resetEmail.trim()}
                        className="px-4 py-2 bg-[#396254] text-white rounded hover:bg-[#2d4d3f] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {resetPasswordPending ? 'Sending...' : 'Reset Password'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                    <p className="text-gray-600 text-sm mb-6">
                      We've sent a password reset link to <strong>{resetEmail}</strong>
                    </p>
                    <button
                      type="button"
                      onClick={closeForgotPasswordModal}
                      className="w-full px-4 py-2 bg-[#396254] text-white rounded hover:bg-[#2d4d3f] transition-colors cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}