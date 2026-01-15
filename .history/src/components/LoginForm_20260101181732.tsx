import { useState } from 'react';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <div className="flex justify-end mt-2">
          <button type="button" className="text-xs text-gray-900 underline hover:no-underline font-bold">
            Forgot password?
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-600 pt-2 text-center font-bold">
        By logging in you agree to the <span className="font-bold">Terms</span> and <span className="font-bold">Privacy</span>
      </p>

      <button
        type="submit"
        className="w-full bg-[#396254] hover:bg-[#2d4d3f] text-white py-3 rounded-sm font-medium text-base transition-colors cursor-pointer"
      >
        Sign In
      </button>
    </form>
  );
}
