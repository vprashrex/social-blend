import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePostReq } from "../../hooks/usePostReq";
import ErrorCon from "../ErrorCon";
import Loading from "../Loading";
import SuccessCon from "../SuccessCon";

export default function AccountDetails() {
  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [isSuccess, setIsSuccess] = useState("");

  const { currentUser } = useAuth();
  const { error, loading, setError, execute } = usePostReq(
    "auth/update-password"
  );

  async function handleSubmit(e) {
    e.preventDefault();

    if (newPass !== confirmPass) {
      setError("Password don't match");
      return setTimeout(() => setError(""), 4000);
    }

    if (newPass === currPass) {
      setError("New password matches current password");
      return setTimeout(() => setError(""), 4000);
    }

    try {
      await execute({ currPass, newPass });
      setIsSuccess("Password Changed Successfully");
      setTimeout(() => setIsSuccess(""), 4000);
    } catch (err) {
      setError(err.response.data.message);
      return setTimeout(() => setError(""), 4000);
    }
    setCurrPass("");
    setNewPass("");
    setConfirmPass("");
    setIsFocus(false);
  }

  return (
    <>
      <ErrorCon error={error} />
      <SuccessCon success={isSuccess} />
      <form className="width-60-form" onSubmit={handleSubmit}>
        <label className="form-label fw-bold" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="form-control"
          defaultValue={currentUser.email}
          disabled
        />

        <div className="mt-5">
          <label className="form-label fw-bold" htmlFor="curr_pass">
            Password
          </label>
          <input
            onFocus={() => setIsFocus(true)}
            type="password"
            placeholder="Enter Current Password"
            value={isFocus ? currPass : "********"}
            onChange={(e) => setCurrPass(e.target.value)}
            id="curr_pass"
            className="form-control"
            required
          />
          {isFocus && (
            <>
              <input
                type="password"
                placeholder="Enter New Password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="form-control mt-3"
                required
              />
              <input
                type="password"
                placeholder="Confrim New Password"
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="form-control mt-3"
              />
            </>
          )}
        </div>
        <div className="text-end">
          <button
            disabled={!(loading || isFocus)}
            type="submit"
            className="btn btn-dark mt-4 w-100"
          >
            {loading ? <Loading /> : "Save"}
          </button>
        </div>
      </form>
    </>
  );
}
