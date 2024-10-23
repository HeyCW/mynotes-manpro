import { useEffect, useState } from "react";
import GoogleAuth from "../../Auth/GoogleAuth";
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { secretKey } from "../../babi";
import useAuth  from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Login = () => {
    const [borderOn, setBorderOn] = useState(true);
    const [token, setToken] = useState(null);
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    // Handle login
    const handleLogin = () => {
        Cookies.set('token', token, { expires: 7});
        login(token);
        navigate('/user/home');
    };

    const handleTokenLoginManual = async () => {
        try {
            await axios.post('http://localhost:5000/api/users/getByEmail', {
                
                    email: email
                
            }).then(res => {
                const decryptedPassword = CryptoJS.AES.decrypt(res.data.password, secretKey).toString(CryptoJS.enc.Utf8);
                if (password === decryptedPassword) {
                    console.log('Password benar');
                    handleToken(res.data.token);
                }
                else {
                    alert('Password salah');
                }
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    

    const handleToken = (token) => {
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

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <div className="flex items-center justify-center mb-10">
                    <h1 className="text-7xl font-bold mr-3">My Notes</h1>
                    <div className={`border-l-4 ${borderOn ? 'border-l-black' : 'border-l-transparent'} p-10`}></div>
                </div>
                <div className="grid w-[58%] mx-auto">
                    <h2 className="text-3xl font-semibold mt-4 mb-5">Login</h2>
                    <label htmlFor="" className="text-start font-semibold">Email</label>
                    <input type="text" className="border-2 p-1 mb-5 rounded-lg" placeholder="Masukkan Email Anda" value={email} onChange={handleEmail}/>

                    <label htmlFor="" className="text-start font-semibold">Password</label>
                    <input type="password" className="border-2 p-1 mb-10 rounded-lg" placeholder="Masukkan Password Anda" value={password} onChange={handlePassword}/>

                    <button className="font-bold bg-blue-500 p-1 rounded-lg hover:bg-blue-600 hover:text-white mb-10" onClick={handleTokenLoginManual}>Login</button>
                    <button className="font-bold w-full bg-blue-500 p-1 rounded-lg hover:bg-blue-600 hover:text-white" onClick={handleRegister}>Register</button>

                </div>
                <div className="grid w-1/2 mx-auto p-0 m-0 mb-10">    
                    <GoogleAuth onHandleToken={handleToken}/>
                </div>
            </div>
        </div>
    );
}

export default Login;