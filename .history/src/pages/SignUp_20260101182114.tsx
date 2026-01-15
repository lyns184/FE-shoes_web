import { useState } from 'react';
import SignUpForm from '../components/SignUpForm';
import LoginForm from '../components/LoginForm';
import SocialLogin from '../components/SocialLogin';

export default function SignUp() {
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');

  return (
    <div className="min-h-screen bg-[#396254] relative flex flex-col">
      {/* Gradient overlay at corners */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-white/10 pointer-events-none"></div>
      
      {/* Header */}
      <header className="relative bg-white/10 backdrop-blur-sm py-4">
        <div className="container mx-auto px-4 flex items-center justify-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-12" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md border border-gray-300 bg-white">
          {/* Tabs */}
          <div className="grid grid-cols-2 border-b">
            <button
              onClick={() => setActiveTab('signup')}
              className={`py-4 text-center font-medium transition-colors cursor-pointer ${
                activeTab === 'signup'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className={`py-4 text-center font-medium transition-colors cursor-pointer ${
                activeTab === 'login'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Log In
            </button>
          </div>

          {/* Form */}
          <div className="p-8">
            {activeTab === 'signup' ? (
              <>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Sign Up</h1>
                <SignUpForm />
                <SocialLogin mode="signup" />
                
                {/* Login Link */}
                <p className="text-center text-sm text-gray-700 mt-6">
                  <span className="font-bold">Already had an account?</span>{' '}
                  <button
                    onClick={() => setActiveTab('login')}
                    className="text-[#396254] underline hover:no-underline cursor-pointer font-bold"
                  >
                    Login
                  </button>
                </p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Log in</h1>
                <LoginForm />
                <SocialLogin mode="login" />
                
                {/* Sign Up Link */}
                <p className="text-center text-sm text-gray-700 mt-6">
                  <span className="font-bold">Need an account?</span>{' '}
                  <button
                    onClick={() => setActiveTab('signup')}
                    className="text-[#396254] underline hover:no-underline cursor-pointer font-bold"
                  >
                    Signup
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
