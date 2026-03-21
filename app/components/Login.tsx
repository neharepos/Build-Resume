"use client"; // Critical: Tells Next.js this is a Client Component

import React, { useContext, useState, ChangeEvent, FormEvent } from 'react';
import { UserContext } from '@/src/context/UserContext';
// import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '@/src/utils/apiPaths';
import { authStyles as styles } from '@/src/assets/dummystyle';
import Input from './Input';
import toast from 'react-hot-toast';
import { validateEmail } from '@/src/utils/helper';

interface LoginProps {
  setCurrentPage: (page: string) => void;
  onSuccess?: () => void;
}

const Login = ({ setCurrentPage, onSuccess: _onSuccess }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);


  const { updateUser: _updateUser } = useContext(UserContext);
  // router is not used because we use window.location.href for hard navigation

 const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setError(null);

    try {
      // Using Native Fetch instead of Axios
      const response = await fetch(API_PATHS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Login successful!");
        // Force hard navigation to securely trigger UserContext refetch with the new HTTP-only cookie
        window.location.href = '/dashboard';
      } else {
        // Handle backend errors (like 401 Unauthorized, 403 Forbidden)
        setError(data.error || data.message || 'Login failed. Please try again.');
      }
    } catch (_err) {
      setError('Network error. Please check your connection.');
    }
  };

  
  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.title}>Welcome Back</h3>
        <p className={styles.subtitle}>
          Sign in to continue building your resume
        </p>
      </div>

      <form onSubmit={handleLogin} className={styles.form}>
        <Input 
          value={email} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          label='Email'
          placeholder='email@example.com'
          type='email'
          required
        />
          
        <Input 
          value={password} 
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          label='Password'
          placeholder='Min 8 characters'
          type='password'
          required
        />

        {error && (
          <div className="text-red-500 text-xs mt-1 animate-pulse">
            {error}
          </div>
        )}

        <button type='submit' className={styles.submitButton}>
          Sign In
        </button>

        <p className={styles.switchText}>
          Don't have an account?{' '}
          <button 
            type='button'
            onClick={() => setCurrentPage('signup')}
            className={styles.switchButton}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;