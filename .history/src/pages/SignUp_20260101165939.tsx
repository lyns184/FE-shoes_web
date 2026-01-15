import { useState } from 'react';
import SignUpForm from '../components/SignUpForm';
import LoginForm from '../components/LoginForm';
import SocialLogin from '../components/SocialLogin';

export default function SignUp() {
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b bg-white py-4">
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
              className={`py-4 text-center font-medium transition-colors ${
                activeTab === 'signup'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className={`py-4 text-center font-medium transition-colors ${
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
                  Already had an account?{' '}
                  <button
                    onClick={() => setActiveTab('login')}
                    className="text-gray-900 underline hover:no-underline"
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
                  Need an account?{' '}
                  <button
                    onClick={() => setActiveTab('signup')}
                    className="text-gray-900 underline hover:no-underline"
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
