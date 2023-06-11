import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePostReq } from "../../hooks/usePostReq";
import Loading from "../Loading";
import ErrorCon from "../ErrorCon";
import { useNavigate } from "react-router-dom";

function Login_onetap() {
  const { loading, execute, error, setError, setLoading } =
    usePostReq("auth/google-ontap");
  const { authStateChange, currentUser } = useAuth();
  const navigate = useNavigate();

  const loggedin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
      );
      console.log(userInfo);
      try {
        await execute({
          email: userInfo.data.email,
          password: userInfo.data.sub,
        });
        await authStateChange();
      } catch (err) {
        setError(err.response.data.message);
        return setTimeout(() => setError(""), 2000);
      } finally {
        setLoading(false);
      }
    },
    onError: (errorResponse) => {
      setLoading(true);
      console.log(errorResponse);
      setError(errorResponse);
      setTimeout(() => setError(""), 4000);
      setLoading(false);
    },
  });

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
      <ErrorCon error={error} />
      <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
        <div>
          <button
            className="btn btn-dark d-flex gap-2 align-items-center w-100 justify-content-center"
            onClick={loggedin}
            disabled={loading}
          >
            <i className="bi bi-google" />
            {loading ? <Loading /> : "Continue with Google"}
          </button>
        </div>
      </GoogleOAuthProvider>
    </>
  );
}

export default Login_onetap;
