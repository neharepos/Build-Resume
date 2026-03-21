"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function LogoutPage() {
  const router = useRouter();
  const hasLoggedOut = useRef(false);

  useEffect(() => {
    if (hasLoggedOut.current) return;
    hasLoggedOut.current = true;

    const performLogout = async () => {
      try {
        await axios.get("/api/users/logout");
        toast.success("Logged out successfully");
        router.push("/login"); // Adjust the route to your login page if it differs
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Logout error:", message);
        toast.error("Failed to logout");
      }
    };
    performLogout();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-lg">Logging out...</p>
    </div>
  );
}

