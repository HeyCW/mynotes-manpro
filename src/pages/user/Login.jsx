import { useEffect, useState } from "react";
import GoogleAuth from "../../Auth/GoogleAuth";
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { secretKey } from "../../babi";
import useAuth  from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import config from "../../config";
import Draw from "../../components/Animation/draw";


const Login = () => {
    const [borderOn, setBorderOn] = useState(true);
    const [token, setToken] = useState(null);
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    // Handle login
    const handleLogin = () => {
        Cookies.set('token', token, { expires: 7 });
        login(token);
        navigate('/user/home');
    };

    const handleTokenLoginManual = async () => {
        try {
            await axios.post(`${config.apiUrl}/api/users/getByEmail`, {
                
                    email: email
                
            }
        
        ).then(res => {
                const decryptedPassword = CryptoJS.AES.decrypt(res.data.password, secretKey).toString(CryptoJS.enc.Utf8);
                if (password === decryptedPassword) {
                    handleToken(res.data.token);
                }
                else {
                    alert('Email / Password salah');
                }
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    

    const handleToken = (token) => {
        const decryptedToken = jwtDecode(token);
        axios.post(`${config.apiUrl}/api/update/token`, {
            'email': decryptedToken.email,
            'token': token
        }).then(res => {
            console.log(res);
        });

        const encryptedToken = CryptoJS.AES.encrypt(token, secretKey).toString();
        setToken(encryptedToken);
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleRegister = () => {
        navigate('/register');
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

    const labelClass = "block mb-2 text-sm font-medium text-gray-900 dark:text-white";
    const inputClass = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

    return (
        <div className="flex items-center justify-center h-screen bg-cover bg-center dark:text-white" style={{ backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1727363542778-269c2812bb55?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)'}}>
            <Draw/>
            /* <div className="absolute z-1 inset-0 bg-white opacity-20"></div> */
            <div className="relative z-10 shadow-xl bg-white bg-opacity-85 dark:bg-gray-900 dark:bg-opacity-[95%] rounded-2xl max-w-2xl">
                <div className="text-center flex items-center justify-center my-10 ml-20 px-8">
                    <h1 className="text-7xl font-bold mr-3">My Notes</h1>
                    <div className={`border-l-4 ${borderOn ? 'border-l-black dark:border-l-white' : 'border-l-transparent'} p-10`}></div>
                </div>
                <div className="grid w-[75%] mx-auto">
                    <h2 className="text-center text-3xl font-semibold mt-4 mb-5">Login</h2>
                    <div className="mb-5">
                        <label htmlFor="" className={labelClass}>Email</label>
                        <input type="text" className={inputClass} placeholder="Masukkan Email Anda" value={email} onChange={handleEmail}/>
                    </div>
                    <div className='mb-5'>
                        <label htmlFor="" className={labelClass}>Password</label>
                        <input type="password" className={inputClass} placeholder="Masukkan Password Anda" value={password} onChange={handlePassword}/>

                    </div>
                    
                    <button className="mb-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleTokenLoginManual}>Login</button>
                    
                    <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleRegister}>Register</button>

                </div>
                <div className="flex items-center justify-center mx-auto p-0 m-0 mb-10">    
                    <GoogleAuth onHandleToken={handleToken}/>
                </div>
            </div>
        </div>
    );
}

export default Login;