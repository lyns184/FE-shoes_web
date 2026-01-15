import { useState } from 'react';
import Logo from '../components/Logo';
import TabNavigation from '../components/TabNavigation';
import SignUpForm from '../components/SignUpForm';
import SocialLogin from '../components/SocialLogin';

export default function SignUp() {
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Logo />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md border border-gray-300 bg-white">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Form */}
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Sign Up</h1>

            <SignUpForm onSwitchToLogin={() => setActiveTab('login')} />

            <SocialLogin />

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
