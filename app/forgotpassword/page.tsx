"use client";

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSendEmail = async () => {
    try {
      setLoading(true);

      const response = await axios.post("/api/users/forgotpassword", {
        email,
      });

      console.log("Success:", response.data);
      toast.success("Reset email sent! Check your inbox.");
    } catch (error: any) {
      console.log("Email send failed:", error.response?.data);
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      
      <h1 className="text-4xl mb-4">
        {loading ? "Processing..." : "Forgot Password"}
      </h1>

      <hr />

      <label htmlFor="email" className="mt-4">
        Registered Email
      </label>

      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />

      <button
        onClick={onSendEmail}
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
        disabled={loading || email.length === 0}
      >
        Send Reset Link
      </button>
    </div>
  );
}