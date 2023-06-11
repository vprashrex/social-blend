import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePostReq } from "../../hooks/usePostReq";
import { useSignUp } from "../../context/SignUpContext";
import Loading from "../Loading";
import ErrorCon from "../ErrorCon";
import { nanoid } from "nanoid";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();
  const { currentLevel } = useSignUp();
  const { loading, execute, error, setError, setLoading } = usePostReq("auth/google");
  const { authStateChange } = useAuth();
  const brandName = "";
  const username = brandName.toLowerCase().replaceAll(" ", "-") + "-" + nanoid(5);

  const auth_flow = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
      );
      const isVerified = userInfo.data.email_verified;
      const email = userInfo.data.email;
      const name = userInfo.data.name;
      const sub = userInfo.data.sub;
      
      try{
        await execute(
          {
            name,
            email,
            username,
            currentLevel,
            type:"Brand",
            sub,
            isVerified,
            brandName
          }
        )
        await authStateChange();
      } catch(err){
        setError(err.response.data.message);
        return setTimeout(()=> setError(""),3000);
      } finally{
        setLoading(false);
      }
      navigate(`/complete-profile/${isVerified ? currentLevel+1:currentLevel}`);
    },
    onError: (error) => {
      setLoading(true);
      setError(error);
      console.log(error);
      setLoading(false);
      return setTimeout(() => setError(""), 3000);
    }
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
