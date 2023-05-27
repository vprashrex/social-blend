import React from "react";

export default function ImgModal({ chat }) {
  return (
    <div
      className="modal fade"
      id={`${chat.id}Modal`}
      tabIndex="-1"
      aria-labelledby={`${chat.id}ModalLabel`}
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-body">
            <img
              alt="Chat"
              src={`${process.env.REACT_APP_API_HOST_NAME}public/chats/${chat.imgName}`}
              width="100%"
              height="100%"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
