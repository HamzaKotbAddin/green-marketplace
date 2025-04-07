import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, auth } from '../firebase-config';

const LoginPage = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLoginWithEmailPassword = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setCurrentPage('home');
    } catch (error) {
      setError('Invalid email or password');
      console.error(error);
    }
  };

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setCurrentPage('home');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already in use.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email format.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long.');
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setCurrentPage('home');
    } catch (error) {
      setError('Google sign-in failed');
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#137333', marginBottom: '24px' }}>
        {isRegistering ? 'Register' : 'Login'}
      </h1>

      {error && <p style={{ color: '#dc2626', marginBottom: '16px' }}>{error}</p>}

      <form autoComplete="on">
        <div style={{ marginBottom: '24px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginBottom: '8px',
              fontSize: '1rem'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>
      </form>

      <button
        onClick={isRegistering ? handleRegister : handleLoginWithEmailPassword}
        style={{
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '4px',
          width: '100%',
          cursor: 'pointer',
          marginBottom: '16px',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
      >
        {isRegistering ? 'Register' : 'Login'}
      </button>

      <p style={{ textAlign: 'center', marginTop: '16px' }}>
        {isRegistering ? (
          <span>
            Already have an account?{' '}
            <button
              onClick={() => setIsRegistering(false)}
              style={{ color: '0 2px 4px rgba(0, 0, 0, 0.89)', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}
            >
              Login
            </button>
          </span>
        ) : (
          <span>
            Don't have an account?{' '}
            <button
              onClick={() => setIsRegistering(true)}
              style={{ color: '0 2px 4px rgba(0, 0, 0, 0.89)', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}
            >
              Register
            </button>
          </span>
        )}
      </p>

      <div style={{ marginTop: '24px' }}>
        <button
          onClick={handleGoogleLogin}
          style={{
            backgroundColor: '#233', // Google blue
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '4px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#231'
            e.target.style.transform = 'scale(1.02)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#233';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <img
            src="/google-g.svg"
            alt="Google"
            style={{ height: '24px', marginRight: '12px', filter: 'brightness(1) invert(0)' }}
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;