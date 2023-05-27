import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSignUp } from "../../context/SignUpContext";
import { useAddData } from "../../hooks/useAddData";
import ErrorCon from "../ErrorCon";
import Loading from "../Loading";
import SignUpIndicator from "./SignUpIndicator";

export default function Gender() {
  const { setCurrentLevel, gender, setGender, currentLevel, data } =
    useSignUp();
  const { currentUser } = useAuth();
  const { error, loading, addData, setError } = useAddData(
    currentUser.type.toLowerCase()
  );
  const navigate = useNavigate();

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
    navigate(`/create-page/${currentLevel.toString()}`);
  }, [currentLevel, navigate]);

  return (
    <>
      <ErrorCon error={error} />
      <form onSubmit={handleSubmit} className="width-60-form">
        <SignUpIndicator />
        <div className="d-flex flex-column">
          <h3 className="fw-bold">What's your gender?</h3>
          <div
            className="mt-3 d-flex form-check flex-column gap-3"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <label
              htmlFor="female"
              className="form-check-label w-100 py-3 border d-flex  align-items-center gap-2 px-5"
            >
              <input
                checked={gender === "Female"}
                className=" form-check-input"
                id="female"
                type="radio"
                value="Female"
                name="gender"
                required
              />
              <span>Female</span>
            </label>
            <label
              htmlFor="male"
              className="border d-flex align-items-center gap-2 py-3 px-5"
            >
              <input
                checked={gender === "Male"}
                className="form-check-input"
                type="radio"
                id="male"
                value="Male"
                name="gender"
                required
              />
              <span>Male</span>
            </label>
            <label
              htmlFor="other"
              className="form-check-label border d-flex  align-items-center gap-2 py-3 px-5"
            >
              <input
                checked={gender === "Other"}
                className="form-check-input"
                type="radio"
                id="other"
                value="Other"
                name="gender"
                required
              />
              <span>Other</span>
            </label>
          </div>
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
