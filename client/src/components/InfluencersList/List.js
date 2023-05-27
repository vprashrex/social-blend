import React from "react";
import { Link } from "react-router-dom";

export default function List({ data }) {
  return (
    <Link to={"/list/" + data.id} className="influencer">
      <div className="img-container">
        <img
          src={`${process.env.REACT_APP_API_HOST_NAME}public/uploads/${data.influencers[0].coverImg}`}
          alt="Influencer"
        />
      </div>
      <div
        className="info d-flex flex-column"
        style={{ bottom: ".5rem", left: ".5rem" }}
      >
        <strong
          style={{
            fontSize: "0.8rem",
          }}
        >
          {data.name}
        </strong>
        <span
          style={{
            fontSize: "0.8rem",
          }}
        >
          {data.influencers.length}{" "}
          {data.influencers.length === 1 ? "influencer" : "influencers"}
        </span>
      </div>
      <div className="overlay h-100"></div>
    </Link>
  );
}
