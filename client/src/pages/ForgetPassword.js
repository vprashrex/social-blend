import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { usePostReq } from "../hooks/usePostReq";
import Loading from "../components/Loading";
import ErrorCon from "../components/ErrorCon";
import SuccessCon from "../components/SuccessCon";

export default function ForgetPassword() {
  const [success, setSuccess] = useState("");
  const { error, loading, execute, setError } = usePostReq(
    "auth/forget-password"
  );
  const emailRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    const email = emailRef.current.value;

    try {
      await execute({ email });
      setSuccess(
        "Your password reset instructions were sent. Please check your email."
      );
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err.response.data.message);
      return setTimeout(() => setError(""), 2000);
    }
  }

  return (
    <>
      <ErrorCon error={error} />
      <SuccessCon success={success} />
      <div
        className="mt-3 w-100 d-flex flex-column gap-4 align-items-center justify-content-center container"
        style={{
          height: "70vh",
        }}
      >
        <div className="d-flex flex-column align-items-center gap-3 justify-content-center ">
          <h1>Reset Password</h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="d-flex flex-column gap-3 form-signup"
        >
          <input
            required
            type="email"
            className="form-control"
            placeholder="Email"
            ref={emailRef}
          />
          <button
            disabled={loading}
            type="submit"
            className="btn btn-dark fw-bold py-2"
          >
            {loading ? <Loading /> : "Send Reset Email"}
          </button>
        </form>
        <Link className="text-center" to="/login">
          Want to try again? Login.
        </Link>
      </div>
    </>
  );
}
