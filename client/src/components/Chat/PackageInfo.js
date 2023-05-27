import React, { useState } from "react";
import { formatCurrency } from "../../utils/formatCurrency";
import { useAuth } from "../../context/AuthContext";
import { useGetReq } from "../../hooks/useGetReq";
import { usePostReq } from "../../hooks/usePostReq";
import SuccessCon from "../SuccessCon";
import ErrorCon from "../ErrorCon";
import Loading from "../Loading";

export default function PackageInfo({ selectedChat, setIsOpenInfo }) {
  const [isAccept, setAccept] = useState(false);
  const [isDecline, setDecline] = useState(false);
  const [isCancel, setCancel] = useState(false);
  const [isRelease, setRelease] = useState(false);
  const [isMark, setMark] = useState(false);
  const [success, setSuccess] = useState("");
  const { order } = selectedChat;
  const { currentUser } = useAuth();
  const orderStatus =
    order.isAccepted && (order.isPaymentRelease || order.isMarkComplete)
      ? "Completed"
      : order.isAccepted && !order.isPaymentRelease
      ? "In-progress"
      : order.isDeclined
      ? "Decline"
      : order.isCanceled
      ? "Cancel"
      : "Request";
  const {
    error,
    loading,
    userData: userPackage,
  } = useGetReq("influencers/package-by-id", {
    packageId: order.order.packageId,
    id: order.id,
  });
  const {
    error: acceptError,
    loading: acceptLoading,
    execute: acceptExecute,
    setLoading: acceptSetLoading,
    setError: acceptSetError,
  } = usePostReq("orders/accept");

  const {
    error: markError,
    loading: markLoading,
    execute: markExecute,
    setLoading: markSetLoading,
    setError: markSetError,
  } = usePostReq("orders/mark-complete");

  const {
    error: declineError,
    loading: declineLoading,
    execute: declineExecute,
    setLoading: declineSetLoading,
    setError: declineSetError,
  } = usePostReq("orders/decline");

  const {
    error: cancelError,
    loading: cancelLoading,
    execute,
    setError,
    setLoading,
  } = usePostReq("orders/cancel");

  const {
    error: releaseError,
    execute: releaseExecute,
    loading: releaseLoading,
    setLoading: releaseSetLoading,
    setError: releaseSetError,
  } = usePostReq("orders/release-payment");

  async function handleRelease() {
    try {
      releaseSetLoading(true);
      await releaseExecute({ orderId: order.id });
      setRelease(true);
      setSuccess("Succesfully release");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      releaseSetError(err.response.data.message);
      setTimeout(() => releaseSetError(""), 2000);
    } finally {
      releaseSetLoading(false);
    }
  }

  async function handleAccept() {
    acceptSetLoading(true);

    try {
      await acceptExecute({ orderId: order.id });
      setAccept(true);
      setSuccess("Order accepted please refresh to see in progress tab");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.log(err);
      acceptSetError("Something Went Wrong");
      setTimeout(() => acceptSetError(""), 4000);
    }

    acceptSetLoading(false);
  }

  async function handleDecline() {
    declineSetLoading(true);

    try {
      await declineExecute({ orderId: order.id });
      setDecline(true);
      setSuccess("Order declined");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.log(err);
      declineSetError("Something Went Wrong");
      setTimeout(() => declineSetError(""), 4000);
    }

    declineSetLoading(false);
  }

  async function handleCancel() {
    setLoading(true);

    try {
      await execute({ orderId: order.id });
      setSuccess("Order canceled");
      setTimeout(() => setSuccess(""), 4000);
      setCancel(true);
    } catch (err) {
      setError("Something went wrong");
      setTimeout(() => setError(""), 4000);
    }

    setLoading(false);
  }

  async function handleMark() {
    markSetLoading(true);

    try {
      await markExecute({ orderId: order.id });
      setSuccess(
        "Successfully marked completed please refresh to see in complete tab"
      );
      setTimeout(() => setSuccess(""), 4000);
      setMark(true);
    } catch (err) {
      console.log(err);
      markSetError("Something Went Wrong");
      setTimeout(() => markSetError(""), 4000);
    }

    markSetLoading(false);
  }

  return (
    <>
      <ErrorCon error={acceptError} />
      <ErrorCon error={declineError} />
      <ErrorCon error={cancelError} />
      <ErrorCon error={releaseError} />
      <ErrorCon error={markError} />
      <SuccessCon success={success} />
      <div className="d-flex align-items-center p-2 gap-2">
        <button className="btn p-0" onClick={() => setIsOpenInfo(false)}>
          <i className="bi bi-x-lg" />
        </button>
        <h4 className="fw-bold">Order</h4>
      </div>
      {orderStatus === "In-progress" ? (
        <div className="bg-warning d-flex flex-column p-2">
          <strong>{orderStatus}</strong>
          <small>
            {currentUser.type === "Influencer"
              ? "Submit your deliverables and mark the order complete when done"
              : "Order accepted by influencer"}
          </small>
        </div>
      ) : orderStatus === "Request" ? (
        <div className="bg-info d-flex flex-column p-2">
          <strong>{orderStatus}</strong>
          <small>
            {currentUser.type === "Influencer"
              ? "Accept or decline the order"
              : "Waiting to accept order"}
          </small>
        </div>
      ) : orderStatus === "Cancel" ? (
        <div className="bg-danger text-light d-flex flex-column p-2">
          <strong>{orderStatus}</strong>
          <small>Order Canceled</small>
        </div>
      ) : orderStatus === "Decline" ? (
        <div className="bg-danger text-light d-flex flex-column p-2">
          <strong>{orderStatus}</strong>
          <small>Order Declined</small>
        </div>
      ) : (
        <div className="bg-success text-light d-flex flex-column p-2">
          <strong>{orderStatus}</strong>
          <small>
            {currentUser.type === "Influencer"
              ? order.isAccepted && order.isPaymentRelease
                ? "Payment release from the brand"
                : "Order completed payment not release from brand"
              : order.isAccepted && order.isPaymentRelease
              ? "You have release the payment"
              : "Order completed from influencer but payment not release from brand"}
          </small>
        </div>
      )}
      <div className="d-flex flex-column justify-content-center align-items-center my-4">
        {orderStatus === "Request" ? (
          <>
            {isAccept ? (
              <strong>Accepted</strong>
            ) : isDecline ? (
              <strong>Declined</strong>
            ) : isCancel ? (
              <strong>Canceled</strong>
            ) : currentUser.type === "Influencer" ? (
              <>
                <button
                  onClick={handleAccept}
                  disabled={acceptLoading}
                  className="btn btn-dark fw-bold px-5 py-2"
                >
                  {acceptLoading ? <Loading /> : "Accept"}
                </button>
                <small>or</small>
                <button
                  onClick={handleDecline}
                  className="btn btn-danger px-5 py-2 fw-bold"
                  disabled={declineLoading}
                >
                  {declineLoading ? <Loading /> : "Decline"}
                </button>
              </>
            ) : (
              <button
                onClick={handleCancel}
                disabled={cancelLoading}
                className="btn btn-danger px-5 py-2 fw-bold"
              >
                {cancelLoading ? <Loading /> : "Cancel Order"}
              </button>
            )}
          </>
        ) : orderStatus === "In-progress" ? (
          currentUser.type === "Influencer" ? (
            isMark ? (
              <strong>Marked Completed</strong>
            ) : (
              <button
                onClick={handleMark}
                disabled={markLoading}
                className="btn btn-dark px-5 py-2 fw-bold"
              >
                {loading ? <Loading /> : "Mark Complete"}
              </button>
            )
          ) : (
            ""
          )
        ) : orderStatus === "Cancel" ? (
          <>
            <strong>Order Canceled</strong>
          </>
        ) : orderStatus === "Decline" ? (
          <>
            <strong>Order Declined</strong>
          </>
        ) : currentUser.type === "Brand" ? (
          isRelease || (order.isAccepted && order.isPaymentRelease) ? (
            <strong>Payment release</strong>
          ) : (
            <button
              onClick={handleRelease}
              className="btn btn-dark px-5 py-2 fw-bold"
              disabled={releaseLoading}
            >
              {releaseLoading ? <Loading /> : "Release payment"}
            </button>
          )
        ) : (
          order.isAccepted &&
          order.isPaymentRelease && <strong>Payment Released</strong>
        )}
      </div>
      <div>
        <ul className="nav nav-pills" id="pills-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              id="pills-details-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-details"
              type="button"
              role="tab"
              aria-controls="pills-details"
              aria-selected="true"
            >
              Details
            </button>
          </li>
          <li className="nav-item ms-5" role="presentation">
            <button
              className="nav-link"
              id="pills-answers-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-answers"
              type="button"
              role="tab"
              aria-controls="pills-answers"
              aria-selected="false"
            >
              Answers
            </button>
          </li>
        </ul>
        <div
          className="tab-content"
          id="pills-tabContent"
          style={{ height: "50vh", overflowY: "scroll" }}
        >
          {!error && !loading && userPackage ? (
            <div
              className="tab-pane fade show active "
              id="pills-details"
              role="tabpanel"
              aria-labelledby="pills-details-tab"
            >
              <div className="d-flex flex-column p-3">
                <strong>{userPackage.heading}</strong>
                <span>{formatCurrency(userPackage.price)}</span>
                <small>{userPackage.description}</small>
              </div>
            </div>
          ) : (
            <Loading />
          )}
          <div
            className="tab-pane fade"
            id="pills-answers"
            role="tabpanel"
            aria-labelledby="pills-answers-tab"
          >
            {order.brandRequirements ? (
              <div className="p-3">
                <div className="d-flex flex-column">
                  <strong>
                    Q.1) Describe the product/service you are promoting
                  </strong>
                  <span>{order.brandRequirements.description}</span>
                </div>
                <div className="d-flex flex-column">
                  <strong>Q.2) What are the content requirements?</strong>
                  <span>{order.brandRequirements.require}</span>
                </div>
                <div className="d-flex flex-column">
                  <strong>
                    Q.3) What do you need from influencer to get started?
                  </strong>
                  <span>{order.brandRequirements.needs}</span>
                </div>
                <div className="d-flex flex-column pb-3">
                  <strong>Q.4) Any additional info?</strong>
                  <span>{order.brandRequirements.additionalInfo}</span>
                </div>
                <div className="d-flex flex-column border-top pt-3">
                  <strong>Content required before posting?</strong>
                  <span>
                    {order.brandRequirements.application.contentApproval
                      ? "Yes"
                      : "No"}
                  </span>
                </div>
                <div className="d-flex flex-column">
                  <strong>Shipping a physical product?</strong>
                  <span>
                    {order.brandRequirements.application.physicalProduct
                      ? "Yes"
                      : "No"}
                  </span>
                  {order.brandRequirements.application.physicalProduct && (
                    <span>
                      Price:{" "}
                      {formatCurrency(
                        order.brandRequirements.application.productPrice
                      )}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <h3>No requirements given</h3>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
