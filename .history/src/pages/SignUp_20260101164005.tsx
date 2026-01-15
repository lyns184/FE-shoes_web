import { useState } from 'react';
import Logo from '../components/Logo';
import TabNavigation from '../components/TabNavigation';
import SignUpForm from '../components/SignUpForm';
import SocialLogin from '../components/SocialLogin';

export default function SignUp() {
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Logo />

      {/* Card */}
      <div className="bg-white rounded-lg shadow-sm w-full max-w-md">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Form Content */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign Up</h2>

          <SignUpForm onSwitchToLogin={() => setActiveTab('login')} />

          <SocialLogin />

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already had an account?{' '}
            <button
              onClick={() => setActiveTab('login')}
              className="text-teal-700 hover:underline font-medium"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
