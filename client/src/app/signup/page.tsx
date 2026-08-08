"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthImagePattern from "@/components/AuthImagePattern";
import toast from "react-hot-toast";

interface SignUpFormData {
  [key: string]: unknown;
  fullName: string;
  email: string;
  password: string;
}

const SignUpPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp, authUser } = useAuthStore();

  useEffect(() => {
    if (authUser) {
      router.push("/");
    }
  }, [authUser, router]);

  const validateForm = (): boolean | string => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signup(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-base-100">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-hidden">
        {/* Abstract background glows */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md space-y-8 glass-panel p-8 sm:p-10 rounded-3xl shadow-2xl z-10">
          {/* LOGO & Header */}
          <div className="text-center mb-6">
            <div className="flex flex-col items-center gap-3 group">
              <div
                className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center
              group-hover:bg-primary/20 group-hover:scale-105 transition-all duration-300 shadow-sm"
              >
                <MessageSquare className="w-7 h-7 text-primary animate-pulse" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight mt-3">Create Account</h1>
              <p className="text-sm text-base-content/60 font-light">
                Get started with your free account
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-semibold text-xs tracking-wider uppercase text-base-content/75">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-11 rounded-xl bg-base-200/50 hover:bg-base-200 focus:bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 outline-none h-12 text-sm"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-semibold text-xs tracking-wider uppercase text-base-content/75">Email Address</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-11 rounded-xl bg-base-200/50 hover:bg-base-200 focus:bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 outline-none h-12 text-sm"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-semibold text-xs tracking-wider uppercase text-base-content/75">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-11 pr-11 rounded-xl bg-base-200/50 hover:bg-base-200 focus:bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 outline-none h-12 text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-base-content/40 hover:text-base-content transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full h-12 rounded-xl text-white font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-base-content/60 font-light">
              Already have an account?{" "}
              <Link href="/login" className="link link-primary no-underline hover:underline font-semibold transition-all">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};
export default SignUpPage;
