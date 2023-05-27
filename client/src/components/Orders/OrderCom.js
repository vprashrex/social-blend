import React from "react";
import { useGetReq } from "../../hooks/useGetReq";
import { useAuth } from "../../context/AuthContext";
import { checkOnline } from "../../utils/checkOnline";
import Loading from "../Loading";

export default function OrderCom({ order, setSelectedChat, selectedChat }) {
  const { currentUser } = useAuth();
  const { error, loading, userData } = useGetReq("influencers/get-by-id", {
    uid:
      currentUser.uid === order.brandUid ? order.influencerUid : order.brandUid,
  });
  const {
    error: _error,
    loading: _loading,
    userData: res,
  } = useGetReq("orders/check-order", { id: order.id });
  return !loading && !error && !_error && !_loading && userData && res ? (
    <button
      onClick={() => {
        setSelectedChat("loading");
        return setTimeout(
          () => setSelectedChat({ chats: res.chats, order }),
          500
        );
      }}
      className={`chat-holder btn w-100 text-start ${
        selectedChat &&
        selectedChat !== "loading" &&
        selectedChat.order.id === order.id
          ? "chat-selected"
          : ""
      }`}
    >
      <img
        className="chat-img"
        alt="Profile"
        src={`${process.env.REACT_APP_API_HOST_NAME}public/uploads/${userData.profileImg}`}
      />
      <div className="chat-info-holder">
        <div>
          <div className="chat-name">{userData.fullName}</div>
          <div className="chat-last-msg">{res.chats?.lastMessage?.chat}</div>
        </div>
        <div className="chat-last-date">
          {checkOnline(userData.lastOnline) === "now" ? (
            <i className="bi bi-dot text-warning" />
          ) : (
            checkOnline(userData.lastOnline)
          )}
        </div>
      </div>
    </button>
  ) : (
    <Loading />
  );
}
