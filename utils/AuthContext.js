import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NEXT_URL } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [apptInfo, setApptInfo] = useState({
    service: '',
    barber: '',
    date: '',
    time: '',
    price: '',
  });

  const router = useRouter();

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const register = async (user) => {
    const res = await fetch(`${NEXT_URL}/api/account/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccessMsg(data.message);
    } else {
      console.log(data);
      setError(data.message);
    }
  };

  //Login
  const login = async ({ email: identifier, password }) => {
    const res = await fetch(`${NEXT_URL}/api/account/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user,
        identifier,
        password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      console.log(data.user);
      setUser(data.user);
      router.push('/account/dashboard');
    } else {
      if (data.message === 'Invalid identifier or password') {
        setError('Invalid email or password.');
      } else {
        setError(data.message);
      }
    }
  };

  //Logout
  const logout = async () => {
    const res = await fetch(`${NEXT_URL}/api/account/logout`, {
      method: 'POST',
    });

    if (res.ok) {
      setUser(null);
    } else {
      setError('Error occurred while trying to log out. Please try again.');
    }
  };

  //Forgot Password
  const forgotPassword = async (email) => {
    const res = await fetch(`${NEXT_URL}/api/account/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccessMsg('Sent! Please check your email.');
    } else {
      setError(data.message);
    }
  };
  const resetPassword = async (passwordInfo) => {
    const { code, password, confirmPassword } = passwordInfo;
    const res = await fetch(`${NEXT_URL}/api/account/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        password,
        confirmPassword,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccessMsg('Success!!');
      setTimeout(() => {
        router.push('/account/login');
      }, 1500);
    } else {
      setError(data.message);
    }
  };

  //Check if user is logged in
  const checkUserLoggedIn = async (user) => {
    const res = await fetch(`${NEXT_URL}/api/account/user`);
    const data = await res.json();

    if (res.ok) {
      setUser(data.user);
    } else {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        successMsg,
        setError,
        setSuccessMsg,
        register,
        login,
        logout,
        checkUserLoggedIn,
        forgotPassword,
        resetPassword,
        setApptInfo,
        apptInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
