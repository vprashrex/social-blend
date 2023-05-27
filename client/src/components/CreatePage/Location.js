import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSignUp } from "../../context/SignUpContext";
import { useAddData } from "../../hooks/useAddData";
import ErrorCon from "../ErrorCon";
import SignUpIndicator from "./SignUpIndicator";

export default function Location() {
  const { location, setLocation, setCurrentLevel, currentLevel, data } =
    useSignUp();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { addData, loading, error, setError } = useAddData(
    currentUser.type.toLowerCase()
  );

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await addData(data);

      setCurrentLevel((prev) => prev + 1);
    } catch {
      return setTimeout(() => setError(""), 2000);
    }
  }

  useEffect(() => {
    navigate(
      `${
        currentUser.type === "Influencer" ? "/create-page" : "/complete-profile"
      }/${currentLevel.toString()}`
    );
  }, [currentLevel, navigate]);

  return (
    <>
      <ErrorCon error={error} />
      <form onSubmit={handleSubmit} className="width-60-form">
        <SignUpIndicator />
        <div className="d-flex flex-column">
          <h3 className="fw-bold">Where are you located</h3>
          <input
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            type="text"
            placeholder="City - Enter first 3 letters and select from dropdown"
            className="my-3 py-2 form-control"
          />
          <button
            disabled={loading}
            type="submit"
            className="btn btn-dark py-2 mt-3"
          >
            {loading ? "" : "Continue"}
          </button>
        </div>
      </form>
    </>
  );
}
