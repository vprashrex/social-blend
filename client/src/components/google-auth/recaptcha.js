import React, { useState } from 'react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha';

function Captcha(){
    return (
        <GoogleReCaptchaProvider reCaptchaKey="6Ld24oAmAAAAAA2pHR2xZvxKCmFluH4N">

        </GoogleReCaptchaProvider>
    )
}

export default Captcha;