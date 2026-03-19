"use client"; // Critical: Tells Next.js this is a Client Component

import React, { useContext, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation'; // Correct Next.js Import
import { UserContext } from '@/src/context/UserContext';
// import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '@/src/utils/apiPaths';
import { authStyles as styles } from '@/public/assets/dummystyle';
import Input from './Input';
import { validateEmail } from '@/src/utils/helper';

interface LoginProps {
  setCurrentPage: (page: string) => void;
  onSuccess?: () => void;
}

const Login = ({ setCurrentPage, onSuccess }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);


  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    // You could add: if(value.includes('@')) { ... }
  };
  
  const { updateUser } = useContext(UserContext);
  const router = useRouter(); // Next.js router hook

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
        // Next.js handles the token and state
        localStorage.setItem('token', data.token);
        updateUser(data);

        if (onSuccess) onSuccess();
        router.push('/dashboard'); 
      } else {
        // Handle backend errors (like 401 Unauthorized)
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
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