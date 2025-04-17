import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleSignIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError('Failed to sign in: ' + err.message);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await googleSignIn();
      router.push('/');
    } catch (err) {
      setError('Failed to sign in with Google: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2>Sign In</h2>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button disabled={loading} type="submit" className={styles.button}>
            Sign In
          </button>
        </form>
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={`${styles.button} ${styles.googleButton}`}
        >
          Sign In with Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;