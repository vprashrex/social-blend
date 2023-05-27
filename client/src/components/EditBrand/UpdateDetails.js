import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAddData } from "../../hooks/useAddData";
import ErrorCon from "../ErrorCon";
import SuccessCon from "../SuccessCon";
import Loading from "../Loading";
import { useAppContext } from "../../context/AppContext";

export default function UpdateDetails() {
  const { currentUser } = useAuth();
  const { influencersCategory } = useAppContext();
  const { loading, error, setError, addData } = useAddData(currentUser.type);

  const [success, setSuccess] = useState("");
  const [location, setLocation] = useState(currentUser.location);
  const [description, setDescription] = useState(currentUser.heading);
  const [categories, setCategories] = useState(currentUser.niches);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = {
      uid: currentUser.uid,
      currentLevel: currentUser.currentLevel,
      heading: description,
      location,
      niches: categories,
      handles: currentUser.handles,
      username: currentUser.username,
      email: currentUser.email,
      fullName: currentUser.fullName,
    };

    try {
      await addData(data);
      setSuccess("Profile updated refresh to reflect changes!");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setTimeout(() => setError(""), 2000);
    }
  }

  function handleChange(e) {
    const isAlreadySelected = categories.some(
      (niche) => niche.name === e.target.value
    );
    if (isAlreadySelected) {
      return setCategories((prev) =>
        prev.filter((niche) => niche.name !== e.target.value)
      );
    }
    setCategories((prev) => [
      ...prev,
      {
        name: e.target.value,
      },
    ]);
  }

  return (
    <>
      <ErrorCon error={error} />
      <SuccessCon success={success} />
      <form
        onSubmit={handleSubmit}
        className="mt-5 edit-page-60 d-flex flex-column gap-4"
      >
        <div className="d-flex flex-column gap-2">
          <label htmlFor="location" className="fw-bold">
            Location
          </label>
          <input
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="form-control"
            id="location"
          />
        </div>
        <div className="d-flex flex-column gap-2">
          <label htmlFor="description" className="fw-bold">
            Description
          </label>
          <input
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
            id="description"
          />
        </div>
        <div className="d-flex flex-column gap-2">
          <label htmlFor="description" className="fw-bold">
            Categories
          </label>
          <div
            onChange={handleChange}
            className="edited-niches d-flex flex-wrap gap-2"
          >
            {influencersCategory.map((influencer) => {
              return (
                <div key={influencer.id}>
                  <input
                    value={influencer.name}
                    type="checkbox"
                    id={influencer.id}
                    checked={categories.some(
                      (niche) => niche.name === influencer.name
                    )}
                    hidden
                  />
                  <label className="p-1 rounded border" htmlFor={influencer.id}>
                    {influencer.name}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-dark px-5 py-2"
          >
            {loading ? <Loading /> : "Save"}
          </button>
        </div>
      </form>
    </>
  );
}
