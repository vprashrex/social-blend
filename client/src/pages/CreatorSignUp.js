import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { useSignUp } from "../context/SignUpContext";
import { usePostReq } from "../hooks/usePostReq";

export default function CreatorSignUp() {
  const [alreadyExist, setAlreadyExist] = useState();

  const navigate = useNavigate();
  const { username } = useParams();
  const {
    about,
    name,
    email,
    pass,
    setPass,
    setName,
    setEmail,
    setAbout,
    currentLevel,
  } = useSignUp();
  const { loading, error, setError, execute } = usePostReq("auth/signup");
  const { authStateChange } = useAuth();
  const { execute: checkExecute } = usePostReq("auth/check-username");

  useEffect(() => {
    checkExecute({
      username,
    }).catch((err) => err.response.status === 409 && setAlreadyExist(true));
  }, [username]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await execute({
        fullName: name,
        email,
        password: pass,
        username,
        about,
        currentLevel,
        type: "Influencer",
      });

      await authStateChange();
    } catch (err) {
      setError(err.response.data.message);
      return setTimeout(() => setError(""), 2000);
    }
    navigate(`/create-page/${currentLevel}`);
  }

  return alreadyExist === true ? (
    <Navigate to="/creator" />
  ) : (
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
      <div className="mt-3 w-100 d-flex flex-column gap-4 align-items-center justify-content-center container">
        <div className="d-flex flex-column align-items-center gap-3 justify-content-center ">
          <h1>Create Your Page</h1>
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
            type="text"
            className="form-control"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            required
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            required
            type="password"
            className="form-control"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <select
            required
            defaultValue={about}
            onChange={(e) => setAbout(e.target.value)}
            className="form-select"
          >
            <option value="default" disabled hidden>
              How did you hear about us
            </option>
            <option value="Facebook">Facebook</option>
            <option value="Friend/Colleague">Friend/Colleague</option>
            <option value="Google">Google</option>
            <option value="Youtube">Youtube</option>
            <option value="Instagram">Instagram</option>
          </select>
          <button
            disabled={loading}
            type="submit"
            className="btn btn-dark fw-bold py-2"
          >
            {loading ? <Loading /> : "Sign Up"}
          </button>
        </form>
        <p
          style={{
            fontSize: "0.7rem",
          }}
        >
          By signing up, you agree to our <Link to="/terms" children="Terms" />{" "}
          and <Link to="/privacy" children="Privacy Policy" />.
        </p>
      </div>
    </>
  );
}
