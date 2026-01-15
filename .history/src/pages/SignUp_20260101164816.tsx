import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaFacebook } from 'react-icons/fa';
import SignUpForm from '../components/SignUpForm';

export default function SignUp() {
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b bg-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-[#396254] rounded-sm"></div>
          <span className="text-2xl font-semibold text-gray-800">Logo.</span>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Sign Up</h1>

            <SignUpForm />

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
              <p className="text-sm text-gray-700 mb-4">Sign up with</p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  className="w-12 h-12 border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Sign up with Google"
                >
                  <FcGoogle className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  className="w-12 h-12 border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Sign up with Apple"
                >
                  <FaApple className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  className="w-12 h-12 border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Sign up with Facebook"
                >
                  <FaFacebook className="w-5 h-5 text-[#1877F2]" />
                </button>
              </div>
            </div>

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
          </div>
        </div>
      </main>
    </div>
  );
}
