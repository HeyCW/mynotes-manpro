import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DropDown from '../../components/DropDown';
import CryptoJS from 'crypto-js';
import { secretKey } from "../../babi";
import axios from 'axios';
import { SignJWT } from 'jose';
import config from '../../config';
import Draw from '../../components/Animation/draw';

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

    const labelClass = "block mb-2 text-sm font-medium text-gray-900 dark:text-white";
    const inputClass = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

    return (
        <div className="flex items-center justify-center min-h-screen dark:text-white">
            <Draw />
            <div className="absolute z-1 inset-0 bg-white opacity-20"></div>
            <div className="absolute z-9 shadow-xl bg-gradient-to-r from-yellow-400 to-amber-200 dark:from-red-500 dark:to-orange-500 rounded-tr-full rounded-bl-full max-w-2xl w-[95%] mx-auto p-0">
                <div className="relative z-10 shadow-xl bg-gradient-to-r from-teal-400 to-yellow-200 bg-opacity-95 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-700 dark:bg-opacity-[95%] rounded-tl-full rounded-br-full max-w-2xl w-[95%] mx-auto m-0">
                    <div className="text-center flex items-center justify-center my-5 sm:my-10 pt-20 px-4 sm:px-8 pl-10 sm:pl-20">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mr-3 sm:mr-3">My Notes</h1>
                        <div className={`border-l-4 ${borderOn ? 'border-l-black dark:border-l-white' : 'border-l-transparent'} p-6 sm:p-10`}></div>
                    </div>
                    <div className="grid w-[75%] mx-auto">
                        <h2 className="text-center text-2xl sm:text-3xl font-semibold mt-4 mb-5">Register</h2>
                        <div className='mb-5'>
                            <label htmlFor="" className={labelClass}>Name</label>
                            <input type="text" className={inputClass} placeholder="Masukkan Name Anda" value={userName} onChange={handleUserName} />
                        </div>
                        <div className='mb-5'>
                            <label htmlFor="" className={labelClass}>Email</label>
                            <input type="text" className={inputClass} placeholder="Masukkan Email Anda" value={email} onChange={handleEmail} />
                        </div>
                        <div className='mb-5'>
                            <label htmlFor="" className={labelClass}>Password</label>
                            <input type="password" className={inputClass} placeholder="Masukkan Password Anda" value={password} onChange={handlePassword} />
                        </div>
                        <div className='mb-5'>
                            <label htmlFor="" className={labelClass}>Major</label>
                            <DropDown options={['Informatika', 'Sistem Informatika', 'Data Science and Analytics']} selected={selected} onSelected={handleSelected} style={"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"} />
                        </div>

                        <div className='flex justify-center w-full'>

                            <button className="w-1/2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={handleRegister}>Register</button>

                        </div>

                        <div className="grid w-1/2 mx-auto p-0 m-0 mb-10">

                        </div>
                    </div>
                </div>
            </div>
        </div>
            )
}

            export default Register;