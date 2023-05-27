import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PrivateRoute({ component }) {
  const { currentUser } = useAuth();

  return currentUser ? component : <Navigate to="/login" />;
}
