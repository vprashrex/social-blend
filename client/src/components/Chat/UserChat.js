import React from "react";
import { useAuth } from "../../context/AuthContext";
import ImgModal from "./ImgModal";
import { scrollToEl } from "../../utils/scrollToEl";
import { checkOnline } from "../../utils/checkOnline";

export default function UserChat({ chat, userData, setReplyingTo }) {
  const { currentUser } = useAuth();
  const data = currentUser.uid === chat.senderId ? currentUser : userData;
  return chat.type === "string" ? (
    <div className="msg-holder" id={chat.id}>
      <img
        className="msg-img"
        src={`${process.env.REACT_APP_API_HOST_NAME}public/uploads/${data.profileImg}`}
        alt="Img"
      />
      <div className="msg-info-holder">
        <div className="d-flex flex-column">
          <span className="msg-name">{data.fullName}</span>
          <div className="msg">{chat.chat}</div>
        </div>
        <button
          onClick={() => setReplyingTo(chat)}
          className="btn reply-icon p-0"
        >
          <i className="bi bi-reply fs-5 " />
        </button>
        <span className="msg-date">{checkOnline(chat.createdAt, true)}</span>
      </div>
    </div>
  ) : chat.type === "img" ? (
    <>
      <div className="msg-holder chat-img-container" id={chat.id}>
        <img
          className="msg-img"
          src={`${process.env.REACT_APP_API_HOST_NAME}public/uploads/${data.profileImg}`}
          alt="Img"
        />
        <div className="msg-info-holder">
          <img
            src={`${process.env.REACT_APP_API_HOST_NAME}public/chats/${chat.imgName}`}
            className="send-chat-img"
            alt="Chat"
          />
          <button
            data-bs-toggle="modal"
            data-bs-target={`#${chat.id}Modal`}
            className="btn hidden-btn"
          ></button>
          <button
            onClick={() => setReplyingTo(chat)}
            className="btn reply-icon p-0"
          >
            <i className="bi bi-reply fs-5 " />
          </button>
          <span className="msg-date">{checkOnline(chat.createdAt, true)}</span>
        </div>
      </div>
      <ImgModal chat={chat} />
    </>
  ) : (
    <div className="msg-holder" id={chat.id}>
      <img
        className="msg-img"
        src={`${process.env.REACT_APP_API_HOST_NAME}public/uploads/${data.profileImg}`}
        alt="Img"
      />
      <div className="msg-info-holder">
        <div className="d-flex flex-column">
          <span className="msg-name">{data.fullName}</span>
          <button
            onClick={() => scrollToEl(chat.repliedTo.id)}
            className="btn badge rounded-pill bg-primary text-start"
          >
            {chat.repliedTo.type === "img" ? "Photo" : chat.repliedTo.chat}
          </button>
          <div className="msg">{chat.chat}</div>
        </div>
        <button
          onClick={() => setReplyingTo(chat)}
          className="btn reply-icon p-0"
        >
          <i className="bi bi-reply fs-5 " />
        </button>
        <span className="msg-date">{checkOnline(chat.createdAt, true)}</span>
      </div>
    </div>
  );
}
