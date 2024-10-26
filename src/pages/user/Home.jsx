import useAuth from "../../hooks/useAuth";
import CryptoJS from 'crypto-js';
import { secretKey } from "../../babi";
import { jwtDecode } from 'jwt-decode';
import BlueButton from "../../components/BlueButton";
import { useNavigate } from "react-router-dom";
import {v4 as uuidV4} from 'uuid';
import NoteContainer from "../../components/Note/NoteContainer";
import { useEffect, useState } from "react";
import BlackButton from "../../components/BlackButton";


const Home = () => {
    const { user } = useAuth();
    const token = user.token;
    const [global, setGlobal] = useState(false);

    try {
        var decryptedToken = token ? CryptoJS.AES.decrypt(token, secretKey).toString(CryptoJS.enc.Utf8) : null;
    } catch (error) {
        console.log(error);
    }
    const decodedToken = decryptedToken ? jwtDecode(decryptedToken) : null;
    const name = decodedToken ? decodedToken.name : null;

    const navigate = useNavigate();

    // Handle clicked create note button
    function handleCreateNote() {
        navigate(`/user/note/${uuidV4()}`);
    }

    function handleGlobalButton() {
        setGlobal(!global);
    }

    return (
        <>  
            <div className="md:flex w-4/5 md:justify-between justify-center text-center mx-auto mt-10">
                <h1 className="text-2xl font-bold mt-0 md:mt-2 mb-10">WELCOME {name}</h1>
            </div>

            <div className="flex w-1/2 gap-10 md:justify-start justify-center mx-auto md:ml-[10%]">
                <BlueButton width={'w-full md:w-1/5 hover:shadow-lg'} handleClick={handleGlobalButton} >{global ? 'Your Work' : 'Global'}</BlueButton>
                <BlackButton width={'w-full md:w-1/5 hover:shadow-lg hover:border-2 hover:border-black'} handleClick={handleCreateNote} >Create Note +</BlackButton>

            </div>
            {global ? <NoteContainer user={decodedToken} global={false} /> :
                <NoteContainer user={decodedToken} global={true}/>
            }
            
        </>


        

        
    );
}
export default Home;