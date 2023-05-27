import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePostReq } from "../../hooks/usePostReq";
import ErrorCon from "../ErrorCon";
import Loading from "../Loading";

export default function DeleteModal() {
  const [reason, setReason] = useState("");

  const { error, loading, execute, setError } = usePostReq(
    "auth/delete-account"
  );
  const { authStateChange } = useAuth();
  const navigate = useNavigate();

  async function handleDelete() {
    if (reason === "") {
      setError("Please select a reason");
      return setTimeout(() => setError(""), 2000);
    }
    try {
      await execute({ reason });
      await authStateChange();
      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
      return setTimeout(() => setError(""), 2000);
    }
  }

  return (
    <>
      <ErrorCon error={error} />

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
                Why Are You Deleting Your Account?
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Once you delete your account, all of your profile and payout
                info will be removed. If you choose to come back, you will need
                to create profile and be verified again.
              </p>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="form-select"
                required
              >
                <option value="" disabled hidden>
                  Please select a reason
                </option>
                <option value="Too busy/Not taking new partnerships">
                  Too busy/Not taking new partnerships
                </option>
                <option value="Not enough orders">Not enough orders</option>
                <option value="I'll be back">I'll be back</option>
                <option value="Other">Other</option>
                <option value="Orders not relevant">Orders not relevant</option>
              </select>
            </div>
            <div className="modal-footer">
              <button
                disabled={loading}
                onClick={handleDelete}
                type="button"
                className="btn btn-dark w-100"
                data-bs-dismiss="modal"
              >
                {loading ? <Loading /> : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
