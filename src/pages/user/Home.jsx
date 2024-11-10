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
    const [searcbValue, setSearchValue] = useState('');

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

    function handleSearch(e) {
        setSearchValue(e.target.value);
    }

    return (
        <>  
            <div className="md:flex w-4/5 md:justify-between justify-center text-center mx-auto mt-10 dark:text-white">
                <h1 className="text-2xl font-bold mt-0 md:mt-2 mb-10">WELCOME {name}</h1>
            </div>

            <div className="flex w-3/4 gap-5 sm:gap-10 flex-col sm:flex-row md:justify-start justify-center mx-auto md:ml-[10%] mb-10">
                <BlueButton width={'w-full md:w-1/5 hover:shadow-lg'} handleClick={handleGlobalButton} >{global ? 'Your Work' : 'Global'}</BlueButton>
                <BlackButton width={'w-full md:w-1/5 hover:shadow-lg'} handleClick={handleCreateNote} >Create Note +</BlackButton>
            </div>

            <div className="relative mx-auto w-full max-w-[85%]">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>

                <input onChange={handleSearch} value={searcbValue} type="text" className="hover:shadow-xl block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Cari untuk menemukan catatan"/>
            </div>

            {global ? <NoteContainer user={decodedToken} global={false} value={searcbValue}/> :
                <NoteContainer user={decodedToken} global={true} value={searcbValue}/>
            }
            
        </>


        

        
    );
}
export default Home;