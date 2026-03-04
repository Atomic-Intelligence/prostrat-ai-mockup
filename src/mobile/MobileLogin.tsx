import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dna, Eye, EyeOff } from 'lucide-react';

export default function MobileLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    navigate('/mobile/home');
  };

  return (
    <div className="flex flex-col min-h-full bg-gradient-to-b from-primary-600 to-primary-800">
      {/* Logo / Brand Area */}
      <div className="flex-1 flex flex-col items-center justify-center pt-16 pb-8">
        <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
          <Dna className="w-10 h-10 text-white" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          ProSTRAT-AI
        </h1>
        <p className="text-primary-200 text-sm mt-1">
          Prostate Cancer Risk Assessment
        </p>
      </div>

      {/* Login Form Card */}
      <div className="bg-white rounded-t-3xl px-6 pt-8 pb-6 flex flex-col gap-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Welcome Back</h2>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to view your results
          </p>
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end">
          <button className="text-sm text-primary-600 font-medium hover:text-primary-700">
            Forgot Password?
          </button>
        </div>

        {/* Sign In Button */}
        <button
          onClick={handleSignIn}
          className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-base transition-colors active:scale-[0.98] transform"
        >
          Sign In
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Create Account */}
        <button className="w-full py-3.5 border border-gray-200 text-gray-700 font-medium rounded-xl text-sm hover:bg-gray-50 transition-colors">
          Create an Account
        </button>

        {/* Version Text */}
        <p className="text-center text-xs text-gray-400 mt-2">
          ProSTRAT-AI v1.0 Demo
        </p>
      </div>
    </div>
  );
}
