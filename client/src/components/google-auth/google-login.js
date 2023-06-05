import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import $ from 'jquery';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


function Signup(props) {
  const { username, currentlevel,type,error,setError } = props;
  const navigate = useNavigate();

  const { authStateChange } = useAuth();

  async function auth(currentLevel){
    try{

      authStateChange();
      

    }catch(error){
      setError(err.response.data.message);
      return setTimeout(() => setError(""),3000);
    }
    navigate(`/create-page/${currentLevel}`);
  }

  const auth_flow = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      $.ajax({
        url:process.env.REACT_APP_API_HOST_NAME + "auth/google",
        dataType: "json",
        type: "POST",
        data: JSON.stringify({
          "code":tokenResponse.code,
          "username": username,
          "currentLevel":currentlevel,
          "type": type,
        }),
        contentType: "application/json",
        crossDomain: true,
        success: function(payload){
          if (payload.message){
            setError(payload.message);
            setTimeout(() => setError(""), 3000);
          }
          else{
            auth(currentlevel);
          }
        }
      })
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
