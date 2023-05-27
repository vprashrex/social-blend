import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSignUp } from "../../context/SignUpContext";
import { useAddData } from "../../hooks/useAddData";
import ErrorCon from "../ErrorCon";
import SignUpIndicator from "./SignUpIndicator";

export default function Summarize() {
  const { summarize, setSummarize, setCurrentLevel, currentLevel, data } =
    useSignUp();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
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
          <h3 className="fw-bold">
            Summarize yourself, this is your title shown on your profile
          </h3>
          <textarea
            required
            rows="5"
            value={summarize}
            onChange={(e) => setSummarize(e.target.value)}
            placeholder="Eg. Fitness Content Creator & Student Athlete"
            className="my-3 py-2 form-control"
            minLength="10"
          />
          <button
            disabled={loading}
            className="btn btn-dark w-100 py-2 my-4"
            type="submit"
          >
            Continue
          </button>
        </div>
      </form>
    </>
  );
}
