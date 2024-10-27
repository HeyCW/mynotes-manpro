import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DropDown from '../../components/DropDown';
import CryptoJS from 'crypto-js';
import { secretKey } from "../../babi";
import axios from 'axios';
import { SignJWT } from 'jose'; 
import config from '../../config';

const Register = () => {

    const [borderOn, setBorderOn] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [selected, setSelected] = useState('Informatika');

    const navigate = useNavigate();

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleUserName = (e) => {
        setUserName(e.target.value);
    }

    const handleSelected = (value) => {
        setSelected(value);
    }

    // Membuat efek ketik
    useEffect(() => {
        const intervalId = setInterval(() => {
            setBorderOn(prevBorderOn => !prevBorderOn);
        }, 200);

        return () => clearInterval(intervalId);
    }, []);

    const handleRegister = async (e) => {
        const user = {
            email: email,
            password: password,
            name: userName,
            major: selected
        }

        const token = await new SignJWT({ email: user.email, name: user.name, major: user.major })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(new TextEncoder().encode(secretKey));

        
            
        axios.post(`${config.apiUrl}/api/users/add`, {
            email: email,
            password: CryptoJS.AES.encrypt(password, secretKey).toString(),
            name: userName,
            major: selected, 
            token: token
        }).then((res) => {
            console.log(res.data);
            navigate('/login');
        }).catch((err) => {
            console.log(err);
        })

    }

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <div className="flex items-center justify-center mb-10">
                    <h1 className="text-7xl font-bold mr-3">My Notes</h1>
                    <div className={`border-l-4 ${borderOn ? 'border-l-black' : 'border-l-transparent'} p-10`}></div>
                </div>
                <div className="grid w-[58%] mx-auto">
                    <h2 className="text-3xl font-semibold mt-4 mb-5">Register</h2>

                    <label htmlFor="" className="text-start font-semibold">Name</label>
                    <input type="text" className="border-2 p-1 mb-5 rounded-lg" placeholder="Masukkan Name Anda" value={userName} onChange={handleUserName}/>

                    <label htmlFor="" className="text-start font-semibold">Email</label>
                    <input type="text" className="border-2 p-1 mb-5 rounded-lg" placeholder="Masukkan Email Anda" value={email} onChange={handleEmail}/>

                    <label htmlFor="" className="text-start font-semibold">Password</label>
                    <input type="password" className="border-2 p-1 mb-5 rounded-lg" placeholder="Masukkan Password Anda" value={password} onChange={handlePassword}/>

                    <label htmlFor="" className="text-start font-semibold">Major</label>
                    <DropDown options={['Informatika', 'Sistem Informatika', 'Data Science and Analytics']} selected={selected} onSelected={handleSelected} style={"mb-10 p-1"}/>

                    <button className="font-bold bg-blue-500 p-1 rounded-lg hover:bg-blue-600 hover:text-white mb-10" onClick={handleRegister}>Register</button>

                </div>
                <div className="grid w-1/2 mx-auto p-0 m-0 mb-10">    
                    
                </div>
            </div>
        </div>
    )
}

export default Register;