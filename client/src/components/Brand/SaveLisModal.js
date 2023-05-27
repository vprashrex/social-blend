import { nanoid } from "nanoid";
import React, { useRef, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { usePostReq } from "../../hooks/usePostReq";
import ErrorCon from "../ErrorCon";
import Loading from "../Loading";
import SuccessCon from "../SuccessCon";

export default function SaveLisModal({ user }) {
  const [newList, setNewList] = useState(false);
  const [success, setSuccess] = useState(false);

  const nameRef = useRef();
  const { currentUser } = useAuth();
  const { userData, setMakeReq } = useAppContext();
  const { error, loading, execute, setError } = usePostReq(
    "lists/add-influencer-list"
  );

  async function handleSubmit(e, listName) {
    e.preventDefault();
    const name = listName ? listName : nameRef.current.value;

    if (name === "") return;

    try {
      await execute({
        id: nanoid(),
        name,
        influencers: [
          {
            uid: user.uid,
            fullName: user.fullName,
            coverImg: user.coverImg,
            location: user.location,
            packages: [user.packages[0]],
            heading: user.heading,
            username: user.username,
          },
        ],
      });
      setMakeReq(Math.floor(Math.random() * 99999));
      setSuccess(`Influencer added to ${name}`);
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err.response.data.message);
      setTimeout(() => setError(""), 2000);
    }
    setNewList(false);
  }

  return (
    <>
      <ErrorCon error={error} />
      <SuccessCon success={success} />
      <div
        className="modal fade "
        id={`exampleModal2${user.uid}`}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="ms-auto modal-title" id="exampleModalLabel">
                Add to List
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body d-flex flex-column gap-2">
              {newList ? (
                <input
                  className="form-control"
                  placeholder="Name"
                  ref={nameRef}
                />
              ) : (
                <>
                  <button
                    onClick={() => setNewList(true)}
                    className="btn p-0 d-flex gap-3 align-items-center"
                  >
                    <strong
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: ".5rem",
                      }}
                      className="bg-dark d-flex justify-content-center align-items-center"
                    >
                      <i className="bi bi-plus-lg fs-1 text-white" />
                    </strong>
                    <span className="fw-bold">Create new list</span>
                  </button>
                  {currentUser &&
                    userData &&
                    userData.lists.length > 0 &&
                    userData.lists.map((list) => {
                      return (
                        <button
                          key={list.id}
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={(e) => handleSubmit(e, list.name)}
                          className="w-100 btn p-0 d-flex gap-3 align-items-center "
                        >
                          <img
                            alt="coverImg"
                            src={`${process.env.REACT_APP_API_HOST_NAME}public/uploads/${list.influencers[0].coverImg}`}
                            style={{ width: "70px", height: "70px" }}
                          />
                          <div className="d-flex flex-column gap-2 ">
                            <span className="text-start fw-bold">
                              {list.name}
                            </span>
                            <span>{list.influencers.length} influencer</span>
                          </div>
                        </button>
                      );
                    })}
                </>
              )}
            </div>
            {newList && (
              <div className="modal-footer">
                <button
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="btn btn-dark w-100 fw-bold"
                >
                  {loading ? <Loading /> : "Create"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
