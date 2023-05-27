import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div
      id="create-brand"
      className="px-3 py-5 text-center hero-container creator-hero"
    >
      <span className="fw-bold fs-1">
        The Easy Way to Generate <h1 className="fw-bold">Sponsored Posts</h1>
      </span>
      <p className="mb-4">
        Find influencers, and get unique content for your brand in seconds
      </p>
      <button
        onClick={() => navigate("/brand-signup")}
        style={{ padding: "6rem 6rem", borderRadius: "10px" }}
        className="py-3 btn btn-dark fw-bold"
        type="button"
      >
        Sign Up
      </button>
    </div>
  );
}
