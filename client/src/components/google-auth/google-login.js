import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import axios from "axios";
import $ from 'jquery';
import { useNavigate } from "react-router-dom";


function Signup(props) {
  const { username, currentlevel,type,error,setError } = props;
  const navigate = useNavigate();

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
            setTimeout(() => setError(""), 3000)
          }
          else{
            navigate(`/create-page/${currentlevel}`);
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

      <GoogleOAuthProvider clientId={process.env.CLIENT_ID}>
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
