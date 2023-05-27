import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSignUp } from "../../context/SignUpContext";
import { useAddData } from "../../hooks/useAddData";
import ErrorCon from "../ErrorCon";
import Loading from "../Loading";
import SignUpIndicator from "./SignUpIndicator";

export default function Description() {
  const { description, setDescription, setCurrentLevel, currentLevel, data } =
    useSignUp();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { error, loading, addData, setError } = useAddData(
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
          <h3 className="fw-bold">Describe yourself and your content</h3>
          <textarea
            required
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Who are you and what type of content do you create? Who is your audience? Be specific as this will help you show up in searches."
            className="my-3 py-2 form-control"
            minLength="100"
          />
          <button
            disabled={loading}
            className="btn btn-dark w-100 py-2 my-4"
            type="submit"
          >
            {loading ? <Loading /> : "Continue"}
          </button>
        </div>
      </form>
    </>
  );
}
