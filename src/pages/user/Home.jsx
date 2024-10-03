import useAuth from "../../hooks/useAuth";
import CryptoJS from 'crypto-js';
import { secretKey } from "../../babi";
import { jwtDecode } from 'jwt-decode';
import BlueButton from "../../components/BlueButton";
import { useNavigate } from "react-router-dom";
import {v4 as uuidV4} from 'uuid';
import NoteContainer from "../../components/Note/NoteContainer";
import { useEffect, useState } from "react";


const Home = () => {
    const { user } = useAuth();
    const token = user.token;
    const decryptedToken = token ? CryptoJS.AES.decrypt(token, secretKey).toString(CryptoJS.enc.Utf8) : null;
    const decodedToken = decryptedToken ? jwtDecode(decryptedToken) : null;
    const name = decodedToken ? decodedToken.name : null;
    const navigate = useNavigate();

    // Handle clicked create note button
    function handleCreateNote() {
        navigate(`/user/note/${uuidV4()}`);
    }

    return (
        <>
            <div className="md:flex w-4/5 md:justify-between justify-center text-center mx-auto mt-10">
                <h1 className="text-2xl font-bold mt-0 md:mt-2">WELCOME {name}</h1>
                <BlueButton width={'w-full md:w-1/5'} handleClick={handleCreateNote} >Create Note +</BlueButton>
            </div>

            <NoteContainer user={decodedToken} />
            
        </>


        

        
    );
}
export default Home;