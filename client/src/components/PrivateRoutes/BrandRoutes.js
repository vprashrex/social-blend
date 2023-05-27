import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function BrandRoutes({ component }) {
  const { currentUser } = useAuth();
  return currentUser && currentUser.type === "Brand" ? (
    component
  ) : (
    <Navigate to="/" />
  );
}
