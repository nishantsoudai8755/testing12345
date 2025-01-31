// pages/admin/login.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const correctPassword = 'Nishant8755@'; // Password for authentication (you can later replace it with a more secure method)

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      // Set a simple authentication flag in localStorage or sessionStorage
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/admin/orders');  // Redirect to orders page after successful login
    } else {
      setErrorMessage('Incorrect Password');
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {errorMessage && <p>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
