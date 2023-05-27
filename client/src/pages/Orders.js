import React, { useEffect, useState } from "react";
import { useGetReq } from "../hooks/useGetReq";
import OrderCom from "../components/Orders/OrderCom";
import ChatArea from "../components/Chat/ChatArea";
import PackageInfo from "../components/Chat/PackageInfo";
import Loading from "../components/Loading";

export default function Orders() {
  // const [success, setSuccess] = useState("");
  const [selectedTab, setSelectedTab] = useState("request");
  const [requestOrders, setRequestOrders] = useState([]);
  const [inProgressOrders, setInProgressOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [isOpenInfo, setIsOpenInfo] = useState(false);

  const { error, loading, userData: orders } = useGetReq("orders", {});

  useEffect(() => {
    setRequestOrders([]);
    setInProgressOrders([]);
    setCompletedOrders([]);
    if (orders) {
      orders.forEach((order) => {
        if (
          order.isAccepted &&
          (order.isPaymentRelease || order.isMarkComplete)
        ) {
          return setCompletedOrders((prev) => [...prev, order]);
        } else if (order.isAccepted && !order.isPaymentRelease) {
          return setInProgressOrders((prev) => [...prev, order]);
        }
        setRequestOrders((prev) => [...prev, order]);
      });
    }
  }, [orders]);

  return !loading && !error && orders ? (
    <div className="orders-holder">
      <div className={`chats-holder ${selectedChat ? "d-mobile-none" : ""}`}>
        <div className="chat-section-title">Orders</div>
        <div className="chat-section-tabs">
          <button
            onClick={() => setSelectedTab("request")}
            className={`chat-section-tab btn ${
              selectedTab === "request" ? "chat-section-tab-selected" : ""
            }`}
          >
            Request
          </button>
          <button
            onClick={() => setSelectedTab("in-progress")}
            className={`chat-section-tab btn ${
              selectedTab === "in-progress" ? "chat-section-tab-selected" : ""
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setSelectedTab("completed")}
            className={`chat-section-tab btn ${
              selectedTab === "completed" ? "chat-section-tab-selected" : ""
            }`}
          >
            Completed
          </button>
        </div>
        <div className="total-chats">
          {
            <>
              {selectedTab === "request" ? (
                <div>
                  {requestOrders.length > 0 ? (
                    requestOrders.map((order) => {
                      return (
                        <OrderCom
                          selectedChat={selectedChat}
                          setSelectedChat={setSelectedChat}
                          order={order}
                          key={order.id}
                        />
                      );
                    })
                  ) : (
                    <div className="d-flex justify-content-center align-items-center my-3">
                      No orders in request
                    </div>
                  )}
                </div>
              ) : selectedTab === "in-progress" ? (
                <div>
                  {inProgressOrders.length > 0 ? (
                    inProgressOrders.map((order) => {
                      return (
                        <OrderCom
                          selectedChat={selectedChat}
                          setSelectedChat={setSelectedChat}
                          order={order}
                          key={order.id}
                        />
                      );
                    })
                  ) : (
                    <div className="d-flex justify-content-center align-items-center my-3">
                      No orders in progress
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {completedOrders.length > 0 ? (
                    completedOrders.map((order) => {
                      return (
                        <OrderCom
                          selectedChat={selectedChat}
                          setSelectedChat={setSelectedChat}
                          order={order}
                          key={order.id}
                        />
                      );
                    })
                  ) : (
                    <div className="d-flex justify-content-center align-items-center my-3">
                      No orders in completed
                    </div>
                  )}
                </div>
              )}
            </>
          }
        </div>
      </div>
      <div
        className={`chat-area ${selectedChat ? "d-mobile-seen" : ""} ${
          isOpenInfo ? "d-mobile-none" : ""
        } `}
      >
        {selectedChat === "loading" ? (
          <Loading />
        ) : selectedChat &&
          (selectedChat.chats !== null || selectedChat.chats === null) ? (
          <ChatArea
            isOpenInfo={isOpenInfo}
            setIsOpenInfo={setIsOpenInfo}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
          />
        ) : (
          ""
        )}
      </div>
      <div
        className={`package-info ${
          isOpenInfo ? "d-mobile-seen" : "d-mobile-none"
        }`}
      >
        {isOpenInfo === "loading" ? (
          <Loading />
        ) : (
          selectedChat &&
          selectedChat.order &&
          isOpenInfo === true && (
            <PackageInfo
              isOpenInfo={isOpenInfo}
              selectedChat={selectedChat}
              setIsOpenInfo={setIsOpenInfo}
            />
          )
        )}
      </div>
    </div>
  ) : (
    <Loading />
  );
}
