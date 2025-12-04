"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const Logo = () => (
  <div className="text-center text-4xl font-bold">
    <span className="text-blue-600">Sync</span>
    <span className="text-gray-900">Space</span>
  </div>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
      if (user) {
        router.push("/dashboard");
      }
    }, [user,router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      const msg =
        err.response?.data?.msg ||
        "Failed to log in. Please check your credentials.";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <>
      <Logo />
      <h2 className="mt-6 text-center text-2xl font-semibold text-gray-900">
        Sign In
      </h2>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <div className="rounded-md border border-red-300 bg-red-50 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 sm:text-sm"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff size={18} strokeWidth={1.75} />
              ) : (
                <Eye size={18} strokeWidth={1.75} />
              )}
            </button>
          </div>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            Forgot your password?
          </a>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Not a member?{" "}
        <Link
          href="/signup"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Sign up now
        </Link>
      </p>
    </>
  );
}
