import { Elements } from "@stripe/react-stripe-js";
import React, { useContext, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const AuthProvider = React.createContext();

export function useAuth() {
  return useContext(AuthProvider);
}

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

export function AuthContext({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  async function authStateChange() {
    setLoading(true);
    await fetch(process.env.REACT_APP_API_HOST_NAME + "auth/check-auth", {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        const user = await res.json();
        if (user.message) {
          return setCurrentUser(undefined);
        }
        setCurrentUser(user);
        setLoading(false);
      })
      .catch(() => {
        setCurrentUser(undefined);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    authStateChange();
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    authStateChange,
  };

  const options = {
    clientSecret: currentUser && currentUser.clientSecret,
  };

  return (
    <AuthProvider.Provider value={value}>
      {!loading && (
        <Elements options={options} stripe={stripePromise}>
          {children}
        </Elements>
      )}
    </AuthProvider.Provider>
  );
}
