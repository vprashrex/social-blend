import { GoogleOAuthProvider,useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import $ from 'jquery';
import { useState } from "react";


function Login_onetap(props) {
    const { error,setError } = props;
    const [loading, setLoading] = useState(false);

    const loggedin = useGoogleLogin({
      onSuccess: async (tokenResponse) => {      
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } },
        );
        try{
          setLoading(true);
          $.ajax({
            url:"http://127.0.0.1:4000/auth/google-ontap",
            dataType: "json",
            type: "POST",
            data: JSON.stringify({
              "email":tokenResponse.data.email,
              "password":tokenResponse.data.sub,
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
                setLoading(false);
              }
            }
          })
        }catch(error){
          setError(error);
          setTimeout(() => setError(""), 3000)
        }
      },
      onError: errorResponse => console.log(errorResponse),
  });

    return(
        <GoogleOAuthProvider clientId="817711081919-0g171iqdflb2mpkhfhpvmnmbglarng97.apps.googleusercontent.com">
        <div>
            <button className="btn btn-dark d-flex gap-2 align-items-center w-100 justify-content-center" onClick={loggedin}>
                <i className="bi bi-google" />
                Continue with Google
            </button>
        </div>
        </GoogleOAuthProvider>
    )   
}

export default Login_onetap;