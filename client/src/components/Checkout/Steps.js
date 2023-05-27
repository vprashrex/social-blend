import React from "react";

export default function Steps({ num, text, desc }) {
  return (
    <div className="d-flex gap-3">
      <strong className="fs-5">{num}</strong>
      <div className="d-flex gap-3 flex-column">
        <span>{text}</span>
        <p>{desc}</p>
      </div>
    </div>
  );
}
