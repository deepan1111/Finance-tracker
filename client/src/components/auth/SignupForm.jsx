import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setFocus,
  } = useForm();

  const watchPassword = watch("password");

  useEffect(() => setFocus("name"), [setFocus]);
  useEffect(() => () => error && clearError(), []); // clear error on unmount

  const onSubmit = async (data) => {
    const { confirmPassword, ...userData } = data;
    try {
      await registerUser(userData);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  // Reusable input style
  const inputClass = (hasError) =>
    `w-full bg-gray-700 text-white placeholder-gray-400 border ${
      hasError ? "border-red-500" : "border-gray-600"
    } rounded-xl px-4 py-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="w-full max-w-lg bg-gray-800 rounded-2xl shadow-2xl p-8 sm:p-10 animate-fade-in border border-gray-700">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-14 w-14 bg-primary-500 rounded-2xl flex items-center justify-center shadow-md">
            <svg
              className="h-7 w-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Start managing your finances today
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 bg-red-900/30 border border-red-600 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 shadow-sm">
            <svg
              className="h-5 w-5 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-6h2v4h-2V7z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-gray-200 mb-1 font-medium">
              Full Name
            </label>
            <input
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Name must be at least 2 characters" },
              })}
              type="text"
              id="name"
              className={inputClass(errors.name)}
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-200 mb-1 font-medium">
              Email Address
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Enter a valid email",
                },
              })}
              type="email"
              id="email"
              className={inputClass(errors.email)}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Currency */}
          <div>
            <label htmlFor="currency" className="block text-gray-200 mb-1 font-medium">
              Preferred Currency
            </label>
            <select
              {...register("currency", { required: "Please select a currency" })}
              id="currency"
              className={inputClass(errors.currency)}
            >
              <option value="">Select currency</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="INR">INR - Indian Rupee</option>
            </select>
            {errors.currency && <p className="text-red-400 text-sm mt-1">{errors.currency.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-gray-200 mb-1 font-medium">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
                type={showPassword ? "text" : "password"}
                id="password"
                className={`${inputClass(errors.password)} pr-12`}
                placeholder="Create a password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-300 hover:text-white transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-200 mb-1 font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <input
                {...register("confirmPassword", {
                  required: "Confirm your password",
                  validate: (value) => value === watchPassword || "Passwords do not match",
                })}
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className={`${inputClass(errors.confirmPassword)} pr-12`}
                placeholder="Re-enter password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-300 hover:text-white transition"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2">
            <input
              {...register("acceptTerms", { required: "You must accept the terms" })}
              id="accept-terms"
              type="checkbox"
              className="h-4 w-4 text-primary-500 rounded border-gray-600 bg-gray-700 focus:ring-primary-500"
            />
            <label htmlFor="accept-terms" className="text-sm text-gray-300">
              I agree to the{" "}
              <Link to="/terms" className="text-primary-400 hover:underline">
                Terms
              </Link>{" "}
              &{" "}
              <Link to="/privacy" className="text-primary-400 hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.acceptTerms && <p className="text-red-400 text-sm mt-1">{errors.acceptTerms.message}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-xl shadow-lg transition duration-300 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Sign-in link */}
          <p className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
