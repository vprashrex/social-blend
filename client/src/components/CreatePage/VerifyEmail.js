import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSignUp } from "../../context/SignUpContext";
import { usePostReq } from "../../hooks/usePostReq";
import ErrorCon from "../ErrorCon";
import Loading from "../Loading";

export default function VerifyEmail() {
  const { authStateChange, currentUser } = useAuth();
  const { email, currentLevel, setCurrentLevel } = useSignUp();
  const { loading, error, execute, setError } = usePostReq("auth/verify-otp");
  const {
    loading: _loading,
    error: _error,
    execute: _execute,
    setError: _setError,
  } = usePostReq("auth/resend-email");
  const codeRef = useRef();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const code = codeRef.current.value;
    try {
      await execute({ code });
      await authStateChange();
    } catch (err) {
      setError(err.response.data.message);
      return setTimeout(() => setError(""), 2000);
    }

    setCurrentLevel((prev) => prev + 1);
  }

  useEffect(() => {
    navigate(
      `${
        currentUser.type === "Influencer" ? "/create-page" : "/complete-profile"
      }/${currentLevel.toString()}`
    );
  }, [currentLevel, navigate]);

  async function handleResend() {
    try {
      await _execute();
    } catch (err) {
      _setError(err.response.data.message);
      return setTimeout(() => _setError(""), 2000);
    }
  }

  return (
    <>
      <ErrorCon error={error} />
      <form onSubmit={handleSubmit} className="width-60-form">
        <h3 className="fw-bold">Verify your email</h3>
        <p>
          We sent an email to {email}. Check your inbox and enter the 6-digit
          code to verify your email.
        </p>
        <input
          ref={codeRef}
          required
          type="text"
          className="form-control"
          placeholder="6-Digit Code"
          pattern="^[0-9]{6}$"
        />
        <button
          disabled={loading}
          className="btn btn-dark w-100 py-2 my-4"
          type="submit"
        >
          {loading ? <Loading /> : "Continue"}
        </button>
        <button
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          className="btn text-dark w-100 text-center"
        >
          I didn't receive an email
        </button>
      </form>
      <ErrorCon error={_error} />
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
                Can't Find the Email?
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="border rounded p-2">
                <h5 className="fw-bold">1. Check All of Your Folders</h5>
                <p>
                  Sometimes emails end up in spam or folders other than your
                  inbox. Be sure to check all of your folders for the
                  verification email
                </p>
              </div>
              <div className="border rounded mt-3 p-2">
                <h5 className="fw-bold">2. Resend Email</h5>
                <p>
                  If you still can't find the email, try resending it using the
                  button below.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                disabled={_loading}
                onClick={handleResend}
                type="button"
                className="btn btn-dark w-100"
              >
                {_loading ? <Loading /> : " Resend Email"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
