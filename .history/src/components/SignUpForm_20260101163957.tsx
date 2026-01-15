import { useState } from 'react';

interface SignUpFormProps {
  onSwitchToLogin: () => void;
}

export default function SignUpForm({ onSwitchToLogin }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agreedToTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign up logic here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* First Name */}
      <div>
        <input
          type="text"
          name="firstName"
          placeholder="First Name*"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
          required
        />
      </div>

      {/* Last Name */}
      <div>
        <input
          type="text"
          name="lastName"
          placeholder="Last Name*"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
          required
        />
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          name="email"
          placeholder="Email Address*"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
          required
        />
      </div>

      {/* Password */}
      <div>
        <input
          type="password"
          name="password"
          placeholder="Password*"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
          required
        />
        <p className="mt-2 text-xs text-gray-600">
          At least 12 characters, 1 uppercase letter, 1 number & 1 symbol
        </p>
      </div>

      {/* Terms Checkbox */}
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          name="agreedToTerms"
          id="terms"
          checked={formData.agreedToTerms}
          onChange={handleChange}
          className="mt-1 w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-600"
          required
        />
        <label htmlFor="terms" className="text-sm text-gray-700">
          I have read and agree to the{' '}
          <a href="#" className="text-teal-700 hover:underline">
            Terms
          </a>{' '}
          and{' '}
          <a href="#" className="text-teal-700 hover:underline">
            Privacy
          </a>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-teal-700 text-white py-3 rounded-md font-medium hover:bg-teal-800 transition-colors"
      >
        Sign Up
      </button>
    </form>
  );
}
