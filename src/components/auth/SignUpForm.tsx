import { useState } from 'react';
import { register } from '../../services/auth';

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    agreedToTerms: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setEmailExists(false);
    
    // Check password validation before submit
    if (passwordError) {
      setError('Please fix password requirements before submitting.');
      return;
    }

    // Check all fields are filled
    if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.address) {
      setError('Please fill in all fields.');
      return;
    }

    if (!formData.agreedToTerms) {
      setError('Please agree to the Terms and Privacy.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
      });

      if (result.success) {
        setSuccess(result.message || 'Registration successful! Please check your email to verify your account.');
        setFormData({
          name: '',
          email: '',
          password: '',
          phone: '',
          address: '',
          agreedToTerms: false,
        });
      } else {
        // Check if error is about email already existing
        if (result.message?.toLowerCase().includes('email') || result.message?.toLowerCase().includes('already')) {
          setEmailExists(true);
          setError(result.message || 'This email is already registered. Please verify your account or log in.');
        } else {
          setError(result.message || 'Registration failed. Please try again.');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Validate password format in real-time
    if (name === 'password') {
      validatePassword(value);
    }
  };

  const validatePassword = (password: string) => {
    const errors = [];
    
    if (password.length < 12) {
      errors.push('At least 12 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('1 uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('1 number');
    }

    if (errors.length > 0) {
      setPasswordError(`Missing: ${errors.join(', ')}`);
    } else {
      setPasswordError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className={`p-4 border rounded text-sm ${
          emailExists 
            ? 'bg-yellow-50 border-yellow-400 text-yellow-800' 
            : 'bg-red-100 border-red-400 text-red-700'
        }`}>
          <p className="font-semibold mb-2">{emailExists ? '⚠️ Email Already Registered' : '❌ Registration Error'}</p>
          <p>{error}</p>
          {emailExists && (
            <div className="mt-3 space-y-2 text-xs">
              <p className="font-medium">Next steps:</p>
              <ul className="list-disc list-inside space-y-1 text-yellow-700">
                <li>Check your email for verification link</li>
                <li>Didn't receive email? Check spam folder</li>
                <li>Already verified? Log in to your account</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-100 border border-green-400 text-green-700 text-sm rounded">
          {success}
        </div>
      )}

      <input
        type="text"
        name="name"
        placeholder="Full Name*"
        value={formData.name}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-400"
        required
        disabled={isLoading}
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address*"
        value={formData.email}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-400"
        required
        disabled={isLoading}
      />

      <input
        type="tel"
        name="phone"
        placeholder="Phone Number*"
        value={formData.phone}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-400"
        required
        disabled={isLoading}
      />

      <input
        type="text"
        name="address"
        placeholder="Address*"
        value={formData.address}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-400"
        required
        disabled={isLoading}
      />

      <div>
        <input
          type="password"
          name="password"
          placeholder="Password*"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-none focus:outline-none focus:ring-1 ${
            passwordError 
              ? 'border-red-400 focus:ring-red-400' 
              : 'border-gray-300 focus:ring-gray-400'
          }`}
          required
          disabled={isLoading}
        />
        {passwordError ? (
          <p className="text-xs text-red-600 mt-2 font-semibold">
            ❌ {passwordError}
          </p>
        ) : formData.password ? (
          <p className="text-xs text-green-600 mt-2 font-semibold">
            ✓ Password meets requirements
          </p>
        ) : (
          <p className="text-xs text-gray-600 mt-2 font-bold">
            At least 12 characters, 1 uppercase letter & 1 number
          </p>
        )}
      </div>

      <div className="flex items-start gap-2 pt-2">
        <input
          type="checkbox"
          name="agreedToTerms"
          id="terms"
          checked={formData.agreedToTerms}
          onChange={handleChange}
          className="mt-1 w-4 h-4 accent-teal-700"
          required
          disabled={isLoading}
        />
        <label htmlFor="terms" className="text-sm text-gray-700 leading-tight">
          I have read and agree to the Terms and Privacy
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading || passwordError !== null || !formData.agreedToTerms}
        className="w-full bg-[#396254] hover:bg-[#2d4d3f] text-white py-3 rounded-sm font-medium text-base transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Signing Up...' : 'Sign Up'}
      </button>
    </form>
  );
}
