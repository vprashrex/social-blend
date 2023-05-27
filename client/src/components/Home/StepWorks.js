import React from "react";

export default function StepWorks({ head, text, img, step }) {
  return (
    <div className="steps-works">
      <div className="overlay"></div>
      <img
        src={img}
        width="100%"
        height="350px"
        style={{ borderRadius: "10px" }}
        alt="step"
      />
      <div className="info">
        <strong className="fs-5">{step}</strong>
        <strong className="fs-5">{head}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}
