import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import $ from 'jquery';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePostReq } from "../../hooks/usePostReq";


function Signup(props) {
  const { username, currentlevel,type,error,setError } = props;
  const navigate = useNavigate();

  const { loading, execute } = usePostReq("auth/google");
  const { authStateChange } = useAuth();

  const auth_flow = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try{
        await execute({
          code:tokenResponse.code,
          username: username,
          currentLevel:currentlevel,
          type: type
        })
        await authStateChange();
      }catch (err){
        setError(err.response.data.message);
        return setTimeout(() => setError(""),3000)
      }
      navigate(`/create-page/${currentlevel}`)
    },
    onError: (error) => {
      console.log(error)
    },
    flow:"credential",
  })

  return (

      <GoogleOAuthProvider clientId="817711081919-0g171iqdflb2mpkhfhpvmnmbglarng97.apps.googleusercontent.com">
        <div>
          <button className="btn btn-dark d-flex gap-2 align-items-center w-100 justify-content-center" onClick={auth_flow}>
              <i className="bi bi-google" />
              Continue with Google
          </button>
        </div>
      </GoogleOAuthProvider>
  );
}



export default Signup;
