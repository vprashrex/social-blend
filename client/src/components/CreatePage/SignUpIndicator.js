import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useSignUp } from "../../context/SignUpContext";

export default function SignUpIndicator() {
  const { currentLevel, setCurrentLevel } = useSignUp();
  const { currentUser } = useAuth();
  return (
    <div className="mb-3 d-flex justify-content-between align-items-center">
      <div className="d-flex gap-2">
        {currentLevel > 1 && (
          <button
            type="button"
            onClick={() => setCurrentLevel((prev) => prev - 1)}
            style={{ backgroundColor: "#f2f3f4" }}
            className="btn px-3 text-dark rounded-pill"
          >
            <i className="bi bi-arrow-left text-dark" />
          </button>
        )}
        <button
          type="button"
          style={{ backgroundColor: "#f2f3f4" }}
          className="btn rounded-pill px-3 text-dark"
        >
          View Example Profile
        </button>
      </div>
      <span
        style={{ backgroundColor: "#d6efe2" }}
        className="text-success px-3 py-2 rounded-pill"
      >
        {currentLevel}/{currentUser.type === "Brand" ? (currentUser.brandName === "" ? 6:5):10}
      </span>
    </div>
  );
}
