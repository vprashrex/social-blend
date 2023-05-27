import React, { useState, useEffect, useRef } from "react";
import { useGetReq } from "../../hooks/useGetReq";
import { usePostReq } from "../../hooks/usePostReq";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { nanoid } from "nanoid";
import io from "socket.io-client";
import typingAnimation from "../../animations/typing.gif";
import UserChat from "./UserChat";
import ErrorCon from "../ErrorCon";
import { checkOnline } from "../../utils/checkOnline";
import Loading from "../Loading";

var socket;

export default function ChatArea({
  selectedChat,
  setSelectedChat,
  isOpenInfo,
  setIsOpenInfo,
}) {
  const [chat, setChat] = useState("");
  const [imgErr, setImgErr] = useState("");
  const [makeReq, setMakeReq] = useState(0);
  const [typing, setTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState();
  const [isTyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  const { currentUser } = useAuth();

  const navigate = useNavigate();

  const chatRef = useRef();

  const {
    error: sendErr,
    execute,
    loading: sendLoading,
    setError,
    setLoading,
  } = usePostReq("orders/save-chat");

  const {
    error: saveImgErr,
    execute: saveImgExecute,
    loading: saveImgLoading,
    setError: saveImgSetError,
    setLoading: saveImgSetLoading,
  } = usePostReq("orders/save-chat-img");

  const { error: _error, userData: res } = useGetReq("orders/check-order", {
    id: selectedChat.order.id,
    makeReq,
  });

  const { error, loading, userData } = useGetReq("influencers/get-by-id", {
    uid:
      currentUser.uid === selectedChat.order.brandUid
        ? selectedChat.order.influencerUid
        : selectedChat.order.brandUid,
  });

  useEffect(() => {
    setTimeout(
      () =>
        chatRef.current?.lastElementChild.scrollIntoView({
          behavior: "smooth",
        }),
      500
    );
    socket = io(process.env.REACT_APP_API_HOST_NAME);
    socket.emit("setup", selectedChat.order.id);
    socket.on("connected", () => setSocketConnected(true));
    socket.emit("joinChat", selectedChat.order.id);
    socket.on("typing", () => setIsTyping(true));
    socket.on("stopTyping", () => setIsTyping(false));
  }, [selectedChat.order.id]);

  useEffect(() => {
    socket.on("messageReceived", (newMessage) => {
      if (newMessage.orderId !== selectedChat.order.id) {
        navigate("/");
      } else {
        setMakeReq(Math.random() * 9);
        setTimeout(
          () =>
            chatRef.current?.lastElementChild.scrollIntoView({
              behavior: "smooth",
            }),
          500
        );
      }
    });
  });

  async function handleSend() {
    if (chat === "") return;
    socket.emit("stopTyping", selectedChat.order.id);
    const msg = {
      id: nanoid(),
      orderId: selectedChat.order.id,
      chat,
      type: replyingTo ? "replyTo" : "string",
      createdAt: Date.now(),
      senderId: currentUser.uid,
      receiverId: userData.uid,
      repliedTo: replyingTo,
    };

    try {
      await execute(msg);
      setMakeReq(Math.random() * 99);
      await socket.emit("sendMessage", msg);
      setTimeout(
        () =>
          chatRef.current?.lastElementChild.scrollIntoView({
            behavior: "smooth",
          }),
        500
      );
      setChat("");
      setReplyingTo();
    } catch (err) {
      setError(err.response.data.message);
      setTimeout(() => setError(""), 2000);
    }
    setLoading(false);
  }

  const typingHandler = (e) => {
    setChat(e.target.value);
    chatRef.current?.lastElementChild.scrollIntoView({
      behavior: "smooth",
    });

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat.order.id);
    }

    let lastTypingTime = new Date().getTime();

    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stopTyping", selectedChat.order.id);
        setTyping(false);
      }
    }, timerLength);
  };

  async function handleImg(e) {
    const file = e.target.files[0];
    saveImgSetLoading(true);
    try {
      if (file.size > 0 && file.type.includes("image")) {
        const msg = {
          id: nanoid(),
          orderId: selectedChat.order.id,
          type: "img",
          createdAt: Date.now(),
          senderId: currentUser.uid,
          receiverId: userData.uid,
          imgName: "chat-img",
        };

        const formData = new FormData();
        formData.append("chat-img", file);
        formData.append("chatId", msg.id);
        formData.append("orderId", selectedChat.order.id);

        await execute(msg);
        await saveImgExecute({ formData });
        setMakeReq(Math.random() * 99);
        await socket.emit("sendMessage", msg);
        return setTimeout(
          () =>
            chatRef.current?.lastElementChild.scrollIntoView({
              behavior: "smooth",
            }),
          500
        );
      }
    } catch (err) {
      console.log(err);
      saveImgSetError(err.response.data.message);
      return setTimeout(() => saveImgSetError(""), 4000);
    } finally {
      saveImgSetLoading(false);
    }
    setImgErr("Please select suitable image");
    return setTimeout(() => setImgErr(""), 4000);
  }

  return !error && !loading && userData && res ? (
    <>
      {" "}
      <ErrorCon error={error} />
      <ErrorCon error={sendErr} />
      <ErrorCon error={imgErr} />
      <ErrorCon error={saveImgErr} />
      <ErrorCon error={_error} />
      <div className={`conversation-area ${isOpenInfo ? "d-mobile-none" : ""}`}>
        <div className="conversation-holder">
          <div className="conversation-title-holder">
            <div className="d-flex align-items-center">
              <button
                onClick={() => setSelectedChat()}
                className="btn p-0 back-btn-holder"
              >
                <i className="bi bi-chevron-left" />
              </button>
              <div className="d-flex flex-column">
                <span className="conversation-title">{userData.fullName}</span>
                <small className="ms-2">
                  {checkOnline(userData.lastOnline) === "now"
                    ? "Active now"
                    : `Active ${checkOnline(userData.lastOnline)} ago`}
                </small>
              </div>
            </div>
            <button
              onClick={() => {
                setIsOpenInfo("loading");
                return setTimeout(
                  () =>
                    setIsOpenInfo((prev) =>
                      prev === "loading" ? true : !prev
                    ),
                  500
                );
              }}
              className="btn p-0 d-flex gap-1 align-items-center"
            >
              <span>
                <i className="bi bi-info-circle fs-4" />
              </span>
              <i className="bi bi-chevron-right fs-4" />
            </button>
          </div>
          <div
            style={
              replyingTo
                ? { marginBottom: "5rem", marginTop: "6rem" }
                : { marginTop: "6rem" }
            }
            ref={chatRef}
            className="all-chats-holder"
          >
            {res.chats !== null
              ? res.chats.chat.map((userChat) => {
                  return (
                    <UserChat
                      userData={userData}
                      key={userChat.id}
                      chat={userChat}
                      setReplyingTo={setReplyingTo}
                    />
                  );
                })
              : ""}
            {isTyping ? (
              <div className="msg-holder">
                <img
                  className="msg-img"
                  src={`${process.env.REACT_APP_API_HOST_NAME}public/uploads/${userData.profileImg}`}
                  alt="Img"
                />
                <div className="msg-info-holder">
                  <span className="badge rounded-pill bg-dark">
                    <img
                      src={typingAnimation}
                      alt="Typing"
                      className="mb-5 typing-animation"
                    />
                  </span>
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="conversation-send-holder">
            {replyingTo ? (
              <div className="d-flex w-100 flex-column">
                <div className="w-100 d-flex justify-content-between p-3">
                  <div className="d-flex flex-column">
                    <span>
                      Replying to{" "}
                      <strong>
                        {replyingTo.senderId === currentUser.uid
                          ? "Yourself"
                          : userData.fullName}
                      </strong>
                    </span>
                    <small className="msg">
                      {replyingTo.type === "string"
                        ? replyingTo.chat
                        : replyingTo.type === "img"
                        ? "Photo"
                        : replyingTo.chat}
                    </small>
                  </div>
                  <button className="btn p-0" onClick={() => setReplyingTo()}>
                    <i className="bi bi-x-lg" />
                  </button>
                </div>
                <textarea
                  value={chat}
                  onChange={typingHandler}
                  placeholder="Message..."
                  className="conversation-message-input"
                />
              </div>
            ) : (
              <textarea
                value={chat}
                onChange={typingHandler}
                placeholder="Message..."
                className="conversation-message-input"
              />
            )}
            <input onChange={handleImg} type="file" hidden id="input-file" />
            <label
              htmlFor="input-file"
              className=" add-attachment"
              style={replyingTo ? { marginTop: "5rem" } : {}}
            >
              <i className="bi bi-file-earmark-arrow-down fs-5" />
            </label>
            <button
              onClick={handleSend}
              className="conversation-send-btn"
              style={replyingTo ? { marginTop: "5rem" } : {}}
            >
              {sendLoading || saveImgLoading ? (
                "..."
              ) : (
                <i className="bi bi-send fs-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  ) : (
    <Loading />
  );
}
