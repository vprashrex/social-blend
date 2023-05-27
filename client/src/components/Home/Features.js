import React from "react";

export default function Features({ icon, head, text }) {
  return (
    <div className="d-flex flex-column gap-1">
      <i className={`bi bi-${icon} fs-4`} />
      <strong className="fs-5">{head}</strong>
      <div className="feature-txt">{text}</div>
    </div>
  );
}
