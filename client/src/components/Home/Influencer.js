import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../utils/formatCurrency";
import SignupModal from "../UserPage/SignupModal";
import SaveLisModal from "../Brand/SaveLisModal";
import { usePostReq } from "../../hooks/usePostReq";
import ErrorCon from "../ErrorCon";
import SuccessCon from "../SuccessCon";
import Loading from "../Loading";
import { useAppContext } from "../../context/AppContext";

export default function Influencer({ user }) {
  const [success, setSuccess] = useState("");

  const { currentUser } = useAuth();
  const { userData, setMakeReq } = useAppContext();
  const { error, loading, execute, setError } = usePostReq(
    "lists/remove-influencer-list"
  );

  function truncateStr(str, len) {
    if (str.length > len) return str.slice(0, len) + "...";
    return str;
  }

  async function handleClick() {
    const isAlreadySave =
      userData &&
      (await userData.lists.some((list) =>
        list.influencers.some((influencer) => influencer.uid === user.uid)
      ));

    if (isAlreadySave) {
      try {
        await execute({ uid: user.uid });
        setMakeReq(Math.floor(Math.random() * 99999));
        setSuccess("Influencer remove");
        setTimeout(() => setSuccess(""), 2000);
      } catch (err) {
        setError(err.response.data.message);
        setTimeout(() => setError(""), 2000);
      }
    }
  }

  return (
    <>
      <ErrorCon error={error} />
      <SuccessCon success={success} />
      <div className="influencer">
        {currentUser && currentUser.type === "Brand" ? (
          <button
            disabled={loading}
            onClick={handleClick}
            className="btn"
            data-bs-toggle={`${
              userData &&
              userData.lists.some((list) =>
                list.influencers.some(
                  (influencer) => influencer.uid === user.uid
                )
              )
                ? ""
                : "modal"
            }`}
            data-bs-target={`${
              userData &&
              userData.lists.some((list) =>
                list.influencers.some(
                  (influencer) => influencer.uid === user.uid
                )
              )
                ? ""
                : `#exampleModal2${user.uid}`
            }`}
            style={{
              position: "absolute",
              right: ".5rem",
              top: ".5rem",
              zIndex: "1",
            }}
          >
            {loading ? (
              <Loading />
            ) : (
              <i
                className={`fw-bold fs-5 bi bi-heart${
                  userData &&
                  userData.lists.some((list) =>
                    list.influencers.some(
                      (influencer) => influencer.uid === user.uid
                    )
                  )
                    ? "-fill text-danger"
                    : " text-white"
                }`}
              />
            )}
          </button>
        ) : !currentUser ? (
          <button
            onClick={() => console.log("heelo")}
            style={{
              position: "absolute",
              right: ".5rem",
              top: ".5rem",
              zIndex: "1",
            }}
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            className="btn"
          >
            <i className="bi bi-heart fw-bold fs-5 text-white" />
          </button>
        ) : (
          ""
        )}
        <Link to={"/" + user.username}>
          <div className="img-container">
            <img
              src={`${process.env.REACT_APP_API_HOST_NAME}public/uploads/${user.coverImg}`}
              alt="Influencer"
            />
          </div>
          <div className="info d-flex flex-column">
            <strong
              style={{
                fontSize: "0.8rem",
              }}
            >
              {user.fullName}
            </strong>
            <span
              style={{
                fontSize: "0.8rem",
              }}
            >
              {user.location}
            </span>
          </div>
          <div className="d-flex align-items-center justify-content-between mt-1">
            <span
              className="influencer-handle"
              style={{
                fontSize: "0.7rem",
              }}
            >
              {user.packages[0].platform.replaceAll("-", " ")}
            </span>
            <strong>{formatCurrency(user.packages[0].price)}</strong>
          </div>
          <p>{truncateStr(user.heading, 35)}</p>
          <div className="overlay"></div>
        </Link>
        {!currentUser && <SignupModal />}
        {currentUser && currentUser.type === "Brand" && (
          <SaveLisModal user={user} />
        )}
      </div>
    </>
  );
}
