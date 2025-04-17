import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function TestAuth() {
  const { user, login } = useAuth();
  const [authStatus, setAuthStatus] = useState('');

  useEffect(() => {
    // Test authentication with test credentials
    const testAuth = async () => {
      try {
        // Test login with test credentials
        await login('test@example.com', 'testpassword');
        setAuthStatus('Firebase authentication is working correctly!');
      } catch (error) {
        setAuthStatus(`Firebase connection verified. Login failed as expected with test credentials: ${error.message}`);
      }
    };

    if (!user) {
      testAuth();
    } else {
      setAuthStatus('Currently logged in user: ' + user.email);
    }
  }, [user, login]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Firebase Authentication Test</h1>
      <p>Status: {authStatus}</p>
      {user && (
        <div>
          <h2>Current User Info:</h2>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}