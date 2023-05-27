import React from "react";
import { useNavigate } from "react-router-dom";
import img from "../../assets/imgs/grid.png";

export default function FooterHero({ text, head, location, btnName }) {
  const navigate = useNavigate();

  return (
    <div className="container my-5  grid-hero">
      <div className="grid-info">
        <h1>{head}</h1>
        <p>{text}</p>
        <button
          onClick={() =>
            location[0] === "#"
              ? window.location.replace(location)
              : navigate(location)
          }
          className="btn px-5 py-3 btn-light"
        >
          {btnName}
        </button>
      </div>
      <img src={img} alt="Grid Imgs" loading="lazy" />
    </div>
  );
}
