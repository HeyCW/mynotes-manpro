import { useEffect, useState } from "react";
import GoogleAuth from "../../Auth/GoogleAuth";
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { secretKey } from "../../babi";
import useAuth  from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const [borderOn, setBorderOn] = useState(true);
    const [token, setToken] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Handle login
    const handleLogin = () => {
        Cookies.set('token', token, { expires: 7});
        login(token);
        navigate('/user/home');
    };

    const handleToken = (token) => {
        const encryptedToken = CryptoJS.AES.encrypt(token, secretKey).toString();
        setToken(encryptedToken);
    }

    useEffect(() => {
        if (token) {
            handleLogin();
        }
    }, [token]);

    // Membuat efek ketik
    useEffect(() => {
        const intervalId = setInterval(() => {
            setBorderOn(prevBorderOn => !prevBorderOn);
        }, 200);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <div className="flex items-center justify-center">
                    <h1 className="text-7xl font-bold mr-3">My Notes</h1>
                    <div className={`border-l-4 ${borderOn ? 'border-l-black' : 'border-l-transparent'} p-10`}></div>
                </div>
                <div className="flex w-1/2 mx-auto justify-center mt-4">                
                    <GoogleAuth onHandleToken={handleToken}/>
                </div>
            </div>
        </div>
    );
}

export default Login;