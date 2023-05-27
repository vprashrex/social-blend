import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { usePostReq } from "../../hooks/usePostReq";
import Loading from "../Loading";
import ErrorCon from "../ErrorCon";

export default function ResetPassword() {
  const [_loading, set_Loading] = useState(true);
  const [wrong, setWrong] = useState("");
  const [success, setSuccess] = useState(false);

  const { execute } = usePostReq("auth/check-token");
  const {
    loading,
    error,
    setError,
    execute: _execute,
  } = usePostReq("auth/reset-password");
  const { token } = useParams();
  const newPass1Ref = useRef();
  const newPass2Ref = useRef();

  useEffect(() => {
    execute({ token })
      .then(() => set_Loading(false))
      .catch((err) => {
        set_Loading(false);
        setWrong(err.response.data.message);
      });
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    const newPass = newPass1Ref.current.value;
    const confirmPass = newPass2Ref.current.value;

    if (newPass !== confirmPass) {
      setError("Password don't match!");
      return setTimeout(() => setError(""), 2000);
    }

    try {
      await _execute({ token, newPass });
      setSuccess(true);
    } catch (err) {
      setError(err.response.data.message);
      return setTimeout(() => setError(""), 2000);
    }
  }

  return _loading ? (
    <Loading />
  ) : (
    <>
      <ErrorCon error={error} />
      <div
        className="mt-3 w-100 d-flex flex-column gap-4 align-items-center justify-content-center container"
        style={{
          height: "70vh",
        }}
      >
        {wrong ? (
          <span>{wrong}</span>
        ) : success ? (
          <span>
            Your password has been successfully reset. You can now log in.
          </span>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="d-flex flex-column gap-3 form-signup"
          >
            <input
              required
              type="password"
              className="form-control"
              placeholder="New Password"
              ref={newPass1Ref}
            />
            <input
              required
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              ref={newPass2Ref}
            />
            <button
              disabled={loading}
              type="submit"
              className="btn btn-dark fw-bold py-2"
            >
              {loading ? <Loading /> : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
