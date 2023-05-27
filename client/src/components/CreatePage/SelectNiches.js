import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { useSignUp } from "../../context/SignUpContext";
import { useAddData } from "../../hooks/useAddData";
import ErrorCon from "../ErrorCon";
import Loading from "../Loading";
import SignUpIndicator from "./SignUpIndicator";

export default function SelectNiches() {
  const { influencersCategory } = useAppContext();
  const { setCurrentLevel, currentLevel, niches, setNiches, data } =
    useSignUp();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { loading, error, addData, setError } = useAddData(
    currentUser.type.toLowerCase()
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (niches.length === 0) {
      setError("Please select at least one niches");
      return setTimeout(() => setError(""), 2000);
    }
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

  function handleChange(e) {
    const isAlreadySelected = niches.some(
      (niche) => niche.name === e.target.value
    );
    if (isAlreadySelected) {
      return setNiches((prev) =>
        prev.filter((niche) => niche.name !== e.target.value)
      );
    }
    setNiches((prev) => [
      ...prev,
      {
        name: e.target.value,
      },
    ]);
  }

  return (
    <>
      <ErrorCon error={error} />
      <form onSubmit={handleSubmit} className="width-60-form">
        <SignUpIndicator />
        <div>
          <h3 className="fw-bold">Select the niches that match your content</h3>
          <div onChange={handleChange} className="niches-container my-4">
            {influencersCategory.map((influencer) => {
              return (
                <div key={influencer.id}>
                  <input
                    value={influencer.name}
                    type="checkbox"
                    id={influencer.id}
                    checked={niches.some(
                      (niche) => niche.name === influencer.name
                    )}
                  />
                  <label className="py-3 border" htmlFor={influencer.id}>
                    {influencer.name}
                  </label>
                </div>
              );
            })}
          </div>
          <button disabled={loading} className="btn btn-dark w-100">
            {loading ? <Loading /> : "Continue"}
          </button>
        </div>
      </form>
    </>
  );
}
