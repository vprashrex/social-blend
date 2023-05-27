import React from "react";
import { Link } from "react-router-dom";
import { useGetReq } from "../../hooks/useGetReq";
import ErrorCon from "../ErrorCon";

export default function FeaturedInf() {
  const { error} = useGetReq(
    "influencers/get-featured-users",
    {}
  );

  return (
    <>
      <ErrorCon error={error} />
      <div className="featured-con container">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h3 className="fw-bold">Featured</h3>
            <p
              style={{
                color: "gray",
              }}
            >
              Hire top influencers across all platforms
            </p>
          </div>
          <Link to="/influencers/any/all">See All</Link>
        </div>
        <div className="influencers-con">
          {/* {loading ? (
            <Loading />
          ) : (
            userData.map((user) => {
              return <Influencer user={user} key={user.uid} />;
            })
          )} */}
        </div>
      </div>
    </>
  );
}
