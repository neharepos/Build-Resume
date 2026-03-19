"use client"; // Mandatory for Next.js Context

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { API_PATHS } from "../utils/apiPaths";

// 1. Define the User Type (Adjust properties based on your backend)
interface User {
    id?: string;
    email: string;
    fullName?: string;
    token?: string;
}

// 2. Define the Context Interface
interface UserContextType {
    user: User | null;
    loading: boolean;
    updateUser: (userData: User) => void;
    clearUser: () => void;
}

// 3. Initialize with null but cast to the type to satisfy the ts(2554) error
export const UserContext = createContext<UserContextType | null>(null);

const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    const fetchUser = async () => {
        const accessToken = localStorage.getItem('token');
        
        if (!accessToken) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(API_PATHS.AUTH.GET_PROFILE, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`, // Manual auth header
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error("Unauthorized");

            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error("User not authenticated", error);
            clearUser();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Next.js double-render check & localStorage availability
        if (typeof window !== "undefined") {
            fetchUser();
        }
    }, []);

    const updateUser = (userData: User) => {
        setUser(userData);
        if (userData.token) {
            localStorage.setItem('token', userData.token);
        }
        setLoading(false);
    };

    return (
        <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};



export default UserProvider;