import React from "react";

export default function SuccessCon({ success }) {
  return (
    success && (
      <div className="error-con bg-light d-flex align-items-center justify-content-center">
        <div>
          <div className="d-flex gap-2 align-items-center justify-content-center p-3">
            <i className="bi bi-check-circle text-success fs-5" />
            <span>{success}</span>
          </div>
        </div>
      </div>
    )
  );
}
