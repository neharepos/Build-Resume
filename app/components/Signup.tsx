"use client";

import React, { useContext, useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/src/context/UserContext';
import { authStyles as styles } from '@/public/assets/dummystyle';
import { validateEmail } from '@/src/utils/helper';
import Input from './Input';
import { API_PATHS } from '@/src/utils/apiPaths';

interface SignupProps {
  setCurrentPage: (page: string) => void;
  onSuccess?: () => void;
}

const Signup = ({ setCurrentPage, onSuccess }: SignupProps) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { updateUser } = useContext(UserContext);
  const router = useRouter();

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Validation Logic
    if (!fullName) {
      setError('Please enter your Full Name');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setError(null);

    try {
      // 2. Using Native Fetch (Better for Next.js)
      const response = await fetch(API_PATHS.AUTH.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        updateUser(data);
        
        if (onSuccess) onSuccess(); // Closes modal
        router.push('/dashboard');  // Moves to Dashboard
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.signupTitle}>Create Account</h3>
        <p className={styles.signupSubtitle}>Join thousands of professionals today</p>
      </div>

      <form onSubmit={handleSignup} className={styles.signupForm}>
        <Input 
          value={fullName} 
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
          label='Full Name'
          placeholder='John Doe'
          type='text'
          required
        />

        <Input 
          value={email} 
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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

        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <button type='submit' className={styles.signupSubmit}>
          Create Account
        </button>

        <p className={styles.switchText}>
          Already have an account?{' '}
          <button 
            onClick={() => setCurrentPage('login')}
            type='button' 
            className={styles.signupSwitchButton}
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
};

export default Signup;