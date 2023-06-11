import React, { useEffect, useRef,useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { usePostReq } from "../hooks/usePostReq";
import Login_onetap from "../components/google-auth/google-ontap";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";


export default function Login() {
  const { loading, error, execute, setError } = usePostReq("auth/login");
  const { authStateChange, currentUser } = useAuth();
  const emailRef = useRef();
  const passRef = useRef();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const recaptchaRef = useRef();
  const SITE_KEY = process.env.RECAPTCHA_CLIENT_KEY
  const SECRET_KEY = process.env.RECAPTCHA_CLIENT_SECRET_KEY

  async function handleSubmit(e) {
    e.preventDefault();
    const email = emailRef.current.value;
    const pass = passRef.current.value;

    const token = await recaptchaRef.current.executeAsync();
    setToken(token);
    
    try {
      
      console.log(token)
      const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
        params: {
          secret: SECRET_KEY,
          response: token,
        },
      });

      console.log(response.data);

      
    } catch (err) {
      console.log(err);
      setError("CAPTCHA NOT WORKING");
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

  useEffect(() => {
    const loadScriptByURL = (id, url, callback) => {
      const isScriptExist = document.getElementById(id);

      if (!isScriptExist) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.id = id;
        script.onload = function () {
          if (callback) callback();
        };
        document.body.appendChild(script);
      }

      if (isScriptExist && callback) callback();
    }

    // load the script by passing the URL
    loadScriptByURL("recaptcha-key", `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`, function () {
      console.log("Script loaded!");
    });
  }, []);

  


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
          <GoogleOAuthProvider clientId="817711081919-0g171iqdflb2mpkhfhpvmnmbglarng97.apps.googleusercontent.com">
            <Login_onetap />
          </GoogleOAuthProvider>
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
          <ReCAPTCHA
            sitekey="6Ld24oAmAAAAAA2pHR2xZvxKCmFluH4N-S6djIR6"
            size="invisible"
            badge="bottomright"
            ref={recaptchaRef}
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