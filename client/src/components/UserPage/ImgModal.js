import React from "react";

export default function ImgModal({ img }) {
  return (
    <div
      className="modal fade"
      id="exampleModal1"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {img && (
              <img
                src={`${process.env.REACT_APP_API_HOST_NAME}public/uploads/${img}`}
                alt="Img"
                width="100%"
                height="100%"
                loading="lazy"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
