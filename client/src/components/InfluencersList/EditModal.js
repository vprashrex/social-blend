import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { usePostReq } from "../../hooks/usePostReq";
import ErrorCon from "../ErrorCon";
import Loading from "../Loading";
import SuccessCon from "../SuccessCon";

export default function EditModal({ name }) {
  const [success, setSuccess] = useState("");

  const { setMakeReq } = useAppContext();
  const { error, loading, execute, setError } = usePostReq("lists/update-name");
  const { execute: _execute, setError: _setError } =
    usePostReq("lists/delete-list");
  const listNameRef = useRef();
  const navigate = useNavigate();

  async function handleRename() {
    const listName = listNameRef.current.value;
    try {
      await execute({ name: listName, oldName: name });
      setMakeReq(Math.floor(Math.random() * 9999999));
      setSuccess(`Name changed to ${listName}`);
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err.response.data.message);
      setTimeout(() => setError(""), 2000);
    }
  }

  async function handleDelete() {
    try {
      await _execute({ name });
      setMakeReq(Math.floor(Math.random() * 9999999));
      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
      setTimeout(() => setError(""), 2000);
    }
  }

  return (
    <>
      <ErrorCon error={error} />
      <SuccessCon success={success} />
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit List
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                ref={listNameRef}
                defaultValue={name}
                className="form-control "
              />
            </div>
            <div className="modal-footer">
              <button
                disabled={loading}
                onClick={handleRename}
                type="button"
                className="btn btn-dark py-2 w-100 fw-bold"
                data-bs-dismiss="modal"
              >
                {loading ? <Loading /> : "Rename"}
              </button>
              <button
                onClick={handleDelete}
                type="button"
                disabled={loading}
                data-bs-dismiss="modal"
                className="btn text-danger w-100"
              >
                {loading ? <Loading /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
