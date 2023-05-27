import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function InfluencerRoutes({ component }) {
  const { currentUser } = useAuth();

  return currentUser && currentUser.type === "Influencer" ? (
    component
  ) : (
    <Navigate to="/" />
  );
}
