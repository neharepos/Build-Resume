"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {

  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlToken = searchParams.get("token");
    setToken(urlToken || "");
  }, [searchParams]);

  const onResetPassword = async () => {
    try {
      setLoading(true);

      await axios.post("/api/users/resetpassword", {
        token,
        password,
      });

      setVerified(true);
      toast.success("Password reset successful!");

    } catch (error: any) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">

      <h1 className="text-4xl">Reset Password</h1>

      <h2 className="p-2 bg-orange-500 text-black mt-2">
        {token ? "Token detected" : "No token found"}
      </h2>

      {!verified && (
        <div className="flex flex-col items-center">

          <input
            className="p-2 mt-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
          />

          <button
            onClick={onResetPassword}
            className="p-2 border border-gray-300 rounded-lg mb-4"
            disabled={loading || password.length < 6}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

        </div>
      )}

      {verified && (
        <div className="text-center">

          <h2 className="text-2xl text-green-500">
            Password Reset Successfully!
          </h2>

          <Link href="/login" className="text-blue-500 hover:underline">
            Go to Login
          </Link>

        </div>
      )}

    </div>
  );
}