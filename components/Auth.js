import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Login.module.css';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState('login'); // login, signup, reset

  const { login, signup, googleSignIn, resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else if (mode === 'signup') {
        await signup(email, password);
      } else if (mode === 'reset') {
        await resetPassword(email);
        alert('Password reset email sent!');
        setMode('login');
      }
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2>{mode === 'login' ? 'Login' : mode === 'signup' ? 'Sign Up' : 'Reset Password'}</h2>
        {error && <p className={styles.error}>{error}</p>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          
          {mode !== 'reset' && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          )}

          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? 'Processing...' : 
              mode === 'login' ? 'Login' : 
              mode === 'signup' ? 'Sign Up' : 
              'Reset Password'}
          </button>
        </form>

        <button onClick={handleGoogleSignIn} className={styles.googleButton}>
          Sign in with Google
        </button>

        <div className={styles.links}>
          {mode === 'login' ? (
            <>
              <p onClick={() => setMode('signup')}>Need an account? Sign up</p>
              <p onClick={() => setMode('reset')}>Forgot Password?</p>
            </>
          ) : (
            <p onClick={() => setMode('login')}>Already have an account? Login</p>
          )}
        </div>
      </div>
    </div>
  );
}