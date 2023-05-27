import React from "react";
import { useAppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import List from "../components/InfluencersList/List";
import ErrorCon from "../components/ErrorCon";
import { useNavigate } from "react-router-dom";

export default function InfluencersList() {
  const { userData, loading, error } = useAppContext();
  const navigate = useNavigate();

  return loading ? (
    <Loading />
  ) : userData && userData.lists.length > 0 ? (
    <>
      <ErrorCon error={error} />
      <div className="container my-3">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="mb-5 fw-bold">Lists</h2>
          <button
            onClick={() => navigate("/influencers/any/all")}
            className="btn btn-dark fw-bold px-4"
          >
            Explore Influencers
          </button>
        </div>
        <div className="search-influencers">
          {userData.lists.map((data) => {
            return <List key={data.id} data={data} />;
          })}
        </div>
      </div>
    </>
  ) : (
    <div className="container">
      <div className="d-flex my-3 justify-content-between align-items-center">
        <h2 className="fw-bold">Lists</h2>
        <button
          onClick={() => navigate("/influencers/any/all")}
          className="btn btn-dark fw-bold px-4"
        >
          Explore Influencers
        </button>
      </div>
      <p className="text-center my-5 py-5">
        Your saved influencers will be displayed here. To add an influencer to a
        list, click the "save" button on their profile.
      </p>
    </div>
  );
}
