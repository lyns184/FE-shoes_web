import { useState } from 'react';

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agreedToTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      <input
        type="text"
        name="firstName"
        placeholder="First Name*"
        value={formData.firstName}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-400"
        required
      />

      <input
        type="text"
        name="lastName"
        placeholder="Last Name*"
        value={formData.lastName}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-400"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address*"
        value={formData.email}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-400"
        required
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
        />
        <p className="text-xs text-gray-600 mt-2 font-bold">
          At least 12 characters, 1 uppercase letter, 1 number & 1 symbol
        </p>
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
        />
        <label htmlFor="terms" className="text-sm text-gray-700 leading-tight">
          I have read and agree to the Terms and Privacy
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-[#396254] hover:bg-[#2d4d3f] text-white py-6 rounded-none font-medium text-base transition-colors"
      >
        Sign Up
      </button>
    </form>
  );
}
