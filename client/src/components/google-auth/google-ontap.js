import { GoogleOAuthProvider,useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePostReq } from "../../hooks/usePostReq";



function Login_onetap(props) {
    const { error,setError,navigate } = props;
    
    const { loading,execute } = usePostReq("auth/google-ontap");
    const { authStateChange, currentUser } = useAuth();

    const loggedin = useGoogleLogin({
      onSuccess: async (tokenResponse) => {      
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } },
        );
        try{
          await execute({
            email: userInfo.data.email,
            password: userInfo.data.sub,
          })
          await authStateChange();
        }catch(err){
          setError(err.response.data.message);
          return setTimeout(() => setError(""), 2000);
        }
      },
      onError: errorResponse => console.log(errorResponse),
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