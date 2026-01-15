import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaFacebook } from 'react-icons/fa';

export default function SocialLogin() {
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
    </>
  );
}
