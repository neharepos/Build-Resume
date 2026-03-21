"use client";
import React, { useEffect, useState, Suspense } from "react";
import axiosInstance from "@/src/utils/axiosInstance";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { LayoutTemplate, CheckCircle2, AlertCircle, ArrowRight, Lock } from "lucide-react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const urlToken = searchParams.get("token");
    setToken(urlToken || "");
  }, [searchParams]);

  const onResetPassword = async () => {
    try {
      setLoading(true);
      setError("");

      await axiosInstance.post("/api/users/resetpassword", {
        token,
        password,
      });

      setVerified(true);
      toast.success("Password reset successful!");

    } catch (err: any) {
      const msg = err.response?.data?.error || "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl border border-violet-100 shadow-2xl p-8">
        <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200">
                <LayoutTemplate className="w-8 h-8 text-white"/>
            </div>
        </div>

        <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Reset Password</h1>
            <p className="text-slate-600 font-medium">
                {token ? "Enter your new password below" : "No reset token found in URL"}
            </p>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
                <AlertCircle size={18} />
                {error}
            </div>
        )}

        {!verified && token && (
          <div className="space-y-6">
            <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 ml-1">New Password</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                        <Lock size={18} />
                    </div>
                    <input
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 transition-all text-slate-900 font-bold placeholder:text-slate-400"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <button
              onClick={onResetPassword}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black rounded-2xl hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:hover:scale-100"
              disabled={loading || password.length < 8}
            >
              {loading ? "Updating..." : "Update Password"}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        )}

        {verified && (
          <div className="text-center animate-in fade-in zoom-in duration-500">
            <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-100">
                    <CheckCircle2 size={40} className="text-emerald-500" />
                </div>
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-4">
              Success!
            </h2>
            <p className="text-slate-600 font-medium mb-8">
                Your password has been updated. You can now log in with your new credentials.
            </p>

            <Link href="/" className="inline-flex items-center gap-2 font-black text-violet-600 hover:text-fuchsia-600 transition-colors">
              Continue to Login <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {!token && !verified && (
            <Link href="/" className="w-full py-4 border-2 border-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                Return to Home
            </Link>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}