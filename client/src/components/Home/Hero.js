import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

export default function Hero() {
  const { influencersPlatform } = useAppContext();
  const platformRef = useRef();
  const categoryRef = useRef();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const platform = platformRef.current.value;
    const category = categoryRef.current.value;

    return navigate(`/influencers/${platform}/${category}`);
  }

  return (
    <div
      id="search-influencers"
      className="px-3 py-5 text-center hero-container"
    >
      <h1 className="fw-bold px-4 fs-1">
        Find and Hire Influencers in Seconds
      </h1>
      <div className="col-lg-8 mx-auto">
        <p className="mb-4">
          Find Instagram, TikTok, and YouTube influencers to create unique
          content for your brand
        </p>
        <form onSubmit={handleSubmit} className="influencers-search w-100">
          <div className="select-platform d-flex flex-column w-100 px-3 ">
            <label htmlFor="influencers-platform" className="text-start">
              Platform
            </label>
            <select
              ref={platformRef}
              id="influencers-platform"
              placeholder="Choose a platform"
            >
              {influencersPlatform.map((item) => {
                return (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="empty-div"></div>
          <div className="select-category d-flex flex-column w-100 px-3">
            <label className="text-start" htmlFor="influencers-category">
              Category
            </label>
            <input
              ref={categoryRef}
              type="text"
              placeholder="Enter keywords or categories"
              required
            />
          </div>
          <button type="submit">
            <i className="bi bi-search fs-5 text-light" />
          </button>
        </form>
      </div>
    </div>
  );
}
