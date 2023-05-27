import React from "react";
import Influencer from "./Influencer";
import { Link } from "react-router-dom";
import { useGetReq } from "../../hooks/useGetReq";
import Loading from "../Loading";
import ErrorCon from "../ErrorCon";

export default function PlatformInf({ platform }) {
  const { error, loading, userData } = useGetReq(
    `influencers/get-users-by-platform`,
    {
      platform,
    }
  );

  return (
    <>
      <ErrorCon error={error} />
      <div className="featured-con container my-5">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h3 className="fw-bold">{platform}</h3>
            <p
              style={{
                color: "gray",
              }}
            >
              Hire {platform} influencers
            </p>
          </div>
          <Link to={`/influencers/${platform.toLowerCase()}/all`}>See All</Link>
        </div>
        <div className="influencers-con ">
          {loading ? (
            <Loading />
          ) : (
            userData.map((user, i) => {
              return i <= 3 && <Influencer user={user} key={i} />;
            })
          )}
        </div>
      </div>
    </>
  );
}
