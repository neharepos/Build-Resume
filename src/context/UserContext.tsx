"use client"; // Mandatory for Next.js Context

import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";

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
    };

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/users/profile', {
                credentials: 'include'
            });
            const result = await response.json();
            if (response.ok && result.data) {
                setUser(result.data);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
            setUser(null);
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
        setLoading(false);
    };

    return (
        <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};



export default UserProvider;

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined || context === null) {
        // This "fake" object prevents the app from crashing 
        // while Next.js is still loading the actual context.
        return { 
            user: null, 
            loading: true, 
            updateUser: () => {}, 
            clearUser: () => {} 
        };
    }
    return context;
};