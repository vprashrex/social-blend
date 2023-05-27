import React from "react";

export default function ErrorCon({ error }) {
  return (
    error && (
      <div className="error-con bg-light d-flex align-items-center justify-content-center">
        <div>
          <div className="d-flex gap-2 align-items-center justify-content-center p-3">
            <i className="bi bi-x-circle text-danger fs-5" />
            <span>{error}</span>
          </div>
        </div>
      </div>
    )
  );
}
