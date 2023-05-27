import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorCon from "../components/ErrorCon";
import Influencer from "../components/Home/Influencer";
import Loading from "../components/Loading";
import { useAppContext } from "../context/AppContext";
import { useGetReq } from "../hooks/useGetReq";

export default function SearchPage() {
  const { platform, niches } = useParams();
  const platformRef = useRef();
  const nichesRef = useRef();
  const { influencersPlatform } = useAppContext();
  const navigate = useNavigate();
  const { error, loading, userData } = useGetReq(
    "influencers/get-users-by-query",
    {
      platform: platformRef.current
        ? platformRef.current.value === "user generated content"
          ? platformRef.current.value.toLowerCase().replaceAll(" ", "-")
          : platformRef.current.value
        : "",
      niches: nichesRef.current ? nichesRef.current.value : "",
    }
  );

  async function handleSubmit(e) {
    e.preventDefault();

    return navigate(
      `/influencers/${platformRef.current.value.toLowerCase()}/${nichesRef.current.value.toLowerCase()}`
    );
  }

  return (
    <>
      <ErrorCon error={error} />
      <form
        onSubmit={handleSubmit}
        className="container text-center hero-container col-lg-8 mx-auto influencers-search mb-5"
      >
        <div className="select-platform d-flex flex-column w-100 px-3 ">
          <label htmlFor="influencers-platform" className="text-start">
            Platform
          </label>
          <select
            defaultValue={platform}
            id="influencers-platform"
            placeholder="Choose a platform"
            ref={platformRef}
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
            defaultValue={niches}
            ref={nichesRef}
            type="text"
            placeholder="Enter keywords or categories"
            required
          />
        </div>
        <button type="submit">
          {loading ? (
            <Loading />
          ) : (
            <i className="bi bi-search fs-5 text-light" />
          )}
        </button>
      </form>

      {loading ? (
        <Loading />
      ) : userData.length > 0 ? (
        <div className="container">
          <h3 className="fw-bold my-3">Influencers</h3>
          <div className="search-influencers">
            {userData.map((user) => {
              return <Influencer user={user} key={user.uid} />;
            })}
          </div>
        </div>
      ) : (
        <div className="d-flex container flex-column gap-2">
          <h3 className="fw-bold">No Influencers Found</h3>
          <p>
            We couldn't find any influencers that match your search. Try another
            search or choose a category below.
          </p>
        </div>
      )}
    </>
  );
}
