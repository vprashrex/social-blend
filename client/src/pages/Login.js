import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { usePostReq } from "../hooks/usePostReq";

export default function Login() {
  const { loading, error, execute, setError } = usePostReq("auth/login");
  const { authStateChange, currentUser } = useAuth();
  const emailRef = useRef();
  const passRef = useRef();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const email = emailRef.current.value;
    const pass = passRef.current.value;
    try {
      await execute({ email, password: pass });
      await authStateChange();
    } catch (err) {
      setError(err.response.data.message);
      return setTimeout(() => setError(""), 2000);
    }
  }

  useEffect(() => {
    currentUser &&
      ((currentUser.type === "Influencer" && currentUser.currentLevel === 11) ||
      (currentUser.type === "Brand" && currentUser.currentLevel === 6)
        ? navigate(`/${currentUser.username}`)
        : currentUser.type === "Influencer"
        ? navigate(`/create-page/${currentUser.currentLevel}`)
        : navigate(`/complete-profile/${currentUser.currentLevel}`));
  }, [currentUser, navigate]);

  return (
    <>
      {error && (
        <div className="error-con bg-light d-flex align-items-center justify-content-center">
          <div>
            <div className="d-flex gap-2 align-items-center justify-content-center p-3">
              <i className="bi bi-x-circle text-danger fs-5" />
              <span>{error}</span>
            </div>
          </div>
        </div>
      )}
      <div
        className="mt-3 w-100 d-flex flex-column gap-4 align-items-center justify-content-center container"
        style={{
          height: "70vh",
        }}
      >
        <div className="d-flex flex-column align-items-center gap-3 justify-content-center ">
          <h1>Welcome Back</h1>
          <button className="btn btn-dark d-flex gap-2 align-items-center w-100 justify-content-center">
            <i className="bi bi-google" />
            Continue with Google
          </button>
        </div>
        <div className="separator">
          <span>or</span>
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
          <input
            required
            type="password"
            className="form-control"
            placeholder="Password"
            ref={passRef}
          />
          <button
            disabled={loading}
            type="submit"
            className="btn btn-dark fw-bold py-2"
          >
            {loading ? <Loading /> : "Login"}
          </button>
        </form>
        <Link className="text-center" to="/forget-password">
          Forget Password?
        </Link>
      </div>
    </>
  );
}
