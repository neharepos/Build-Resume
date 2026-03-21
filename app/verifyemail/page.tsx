"use client";

import axiosInstance from "@/src/utils/axiosInstance";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { LayoutTemplate, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const verifyUserEmail = async (tokenStr: string) => {
    try {
      await axiosInstance.post("/api/users/verifyemail", { token: tokenStr });
      setVerified(true);
    } catch (error: unknown) {
      setError(true);
      console.log(error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    if (urlToken) {
      setToken(urlToken);
      verifyUserEmail(urlToken);
    } else {
        setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl border border-violet-100 shadow-2xl p-8">
        <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200">
                <LayoutTemplate className="w-8 h-8 text-white"/>
            </div>
        </div>

        <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Email Verification</h1>
            <p className="text-slate-600 font-medium">
                {loading ? "Verifying your email address..." : 
                 verified ? "Authentication Success" : 
                 error ? "Verification Failed" : "Token Required"}
            </p>
        </div>

        {loading && (
            <div className="flex flex-col items-center gap-4 py-8">
                <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-violet-600 animate-pulse">Checking token...</p>
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
              Verified!
            </h2>
            <p className="text-slate-600 font-medium mb-8">
                Your email has been successfully verified. You can now start building your professional resume.
            </p>

            <Link 
              href="/" 
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black rounded-2xl hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-200 transition-all flex items-center justify-center gap-2 group"
            >
              Continue to Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

        {error && (
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center border-4 border-red-100">
                    <AlertCircle size={40} className="text-red-500" />
                </div>
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 mb-4">
              Error
            </h2>
            <p className="text-slate-600 font-medium mb-8">
               The verification token is invalid or has expired. Please try signing up again or contact support.
            </p>

            <Link href="/" className="inline-flex items-center gap-2 font-black text-red-600 hover:text-red-700 transition-colors">
              Return Home <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {!token && !loading && !verified && !error && (
            <div className="text-center">
                 <p className="text-slate-600 font-medium mb-8">
                    No verification token was found in the link. Please check your email and try again.
                </p>
                <Link href="/" className="w-full py-4 border-2 border-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    Return to Home
                </Link>
            </div>
        )}
      </div>
    </div>
  );
}