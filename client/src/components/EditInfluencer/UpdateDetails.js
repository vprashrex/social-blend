import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAddData } from "../../hooks/useAddData";
import Loading from "../Loading";
import ErrorCon from "../ErrorCon";
import SuccessCon from "../SuccessCon";

export default function UpdateDetails() {
  const { currentUser } = useAuth();

  const [displayName, setDisplayName] = useState(currentUser.fullName);
  const [location, setLocation] = useState(currentUser.location);
  const [title, setTitle] = useState(currentUser.heading);
  const [description, setDescription] = useState(currentUser.about);
  const [gender, setGender] = useState(currentUser.gender);
  const [success, setSucces] = useState("");

  const { loading, error, addData, setError } = useAddData(currentUser.type);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = {
      uid: currentUser.uid,
      currentLevel: currentUser.currentLevel,
      about: description,
      location,
      heading: title,
      gender,
      niches: currentUser.niches,
      packages: currentUser.packages,
      faqs: currentUser.faqs,
      username: currentUser.username,
      email: currentUser.email,
      fullName: displayName,
      handles: currentUser.handles,
    };

    try {
      await addData(data);
      setSucces("Profile updated refresh to reflect changes!");
      setTimeout(() => setSucces(""), 2000);
    } catch (err) {
      setTimeout(() => setError(""), 2000);
    }
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
          <label htmlFor="display-name" className="fw-bold">
            Display Name
          </label>
          <input
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="form-control"
            id="display-name"
          />
        </div>
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
          <label htmlFor="title" className="fw-bold">
            Title
          </label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            id="title"
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
          <label htmlFor="gender" className="fw-bold">
            Gender
          </label>
          <select
            required
            defaultValue={gender}
            onChange={(e) => setGender(e.target.value)}
            className="form-select"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
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
