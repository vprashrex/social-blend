import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePostReq } from "../../hooks/usePostReq";
import { useSignUp } from "../../context/SignUpContext";
import Loading from "../Loading";
import ErrorCon from "../ErrorCon";

function Signup({ username }) {
  const navigate = useNavigate();

  const { currentLevel } = useSignUp();

  const { loading, execute, error, setError, setLoading } =
    usePostReq("auth/google");
  const { authStateChange } = useAuth();

  const auth_flow = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        await execute({
          code: tokenResponse.code,
          username,
          currentLevel,
          type: "Influencer",
        });
        await authStateChange();
      } catch (err) {
        setError(err.response.data.message);
        return setTimeout(() => setError(""), 3000);
      } finally {
        setLoading(false);
      }
      navigate(`/create-page/${currentLevel}`);
    },
    onError: (error) => {
      setLoading(true);
      setError(error);
      console.log(error);
      setLoading(false);
      return setTimeout(() => setError(""), 3000);
    },
    flow: "credential",
  });

  return (
    <>
      <ErrorCon error={error} />
      <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
        <div>
          <button
            disabled={loading}
            className="btn btn-dark d-flex gap-2 align-items-center w-100 justify-content-center"
            onClick={auth_flow}
          >
            <i className="bi bi-google" />
            {loading ? <Loading /> : "Continue with Google"}
          </button>
        </div>
      </GoogleOAuthProvider>
    </>
  );
}

export default Signup;
