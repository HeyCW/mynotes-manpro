import React from 'react';
import { GoogleLogin } from '@react-oauth/google';


const GoogleAuth = ({onHandleToken}) => {
    const updateToken = (token) => {
        onHandleToken(token);
    };

    const responseMessage = (response) => {
        const token = response.credential;
        if (token) {
            updateToken(token);
        } else {
            console.error("Token is not valid");
        }
    };

    const errorMessage = (error) => {
        console.log(error);
    };

    return (
        <div className='mt-10'>
            <GoogleLogin className="" onSuccess={responseMessage} onError={errorMessage} clientId ='682490005599-m3hj1sjh8pikio9m9rb4jh8vgh7o9u18.apps.googleusercontent.com' />
        </div>
    )
}
export default GoogleAuth;