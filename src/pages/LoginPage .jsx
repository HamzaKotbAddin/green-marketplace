import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-config";


const LoginPage = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle email and password login
  const handleLoginWithEmailPassword = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setCurrentPage('home'); // Redirect to home or other page after login
    } catch (error) {
      setError('Invalid email or password');
      console.error(error);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setCurrentPage('home'); // Redirect to home or other page after login
    } catch (error) {
      setError('Google sign-in failed');
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Login</h1>
      {error && <p className="text-red-600">{error}</p>}

      {/* Email and Password login */}
      <div className="mb-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded-md mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <button
        onClick={handleLoginWithEmailPassword}
        className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded-md transition w-full mb-4"
      >
        Login
      </button>
      <div>
     
      <button className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded-md transition w-full mb-4" >regsiter </button>
      </div>
   
      {/* Google Sign-in Button */}
      <div className="flex items-center space-x-4">
        <button onClick={handleGoogleLogin} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 2.2c-5.423 0-9.8 4.277-9.8 9.8 0 1.987.591 3.843 1.596 5.378L2 18.3c-.125-.418-.246-.859-.357-1.286L0 14.627l4.504-.374c-.07-.472-.104-.951-.104-1.454 0-3.475 2.85-6.3 6.374-6.3 1.137 0 2.187.316 3.1.859 1.087-.888 2.396-1.67 3.72-2.187-1.086-.496-2.281-.868-3.5-1.068-.618.344-1.324.593-2.06.74-.77-1.606-2.774-2.75-4.8-2.75z"
            />
          </svg>
          <span className="ml-2">Sign in with Google</span>
        </button>
      </div>

      {/* Back to Cart Button */}
      <button
        onClick={() => setCurrentPage('cart')}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mt-6 w-full"
      >
        Back to Cart
      </button>
    </div>
  )
}

export default LoginPage;
