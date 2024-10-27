import NoteCard from "./NoteCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import CryptoJS from "crypto-js";
import { secretKey } from "../../babi";
import Swal from 'sweetalert2';

const NoteContainer = ({user, global, value=''}) => {

    const location = useLocation();
    let message = location.state?.message;
    const [notes, setNotes] = useState([]);
    const [noteSearch, setNoteSearch] = useState([]);
    const token = Cookies.get('token');
    const decryptedBytes = CryptoJS.AES.decrypt(Cookies.get('token'), secretKey);
    const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const navigate  = useNavigate();

    const showAlert = () => {
        Swal.fire({
          title: 'Forbidden',
          text: message,
          icon: 'error',
          confirmButtonText: 'ok'
        }).then(() => {
            navigate('/user/home', { replace: true });
        });
      };

      if (message) {
            showAlert();
      }

    useEffect(() => {
        // Call an api for fetching notes

        if (!global) {
            async function fetchNotes() {
                try {
                    const response = await axios.get('http://localhost:5000/api/notes', {
                        headers: {
                            'Authorization': `Bearer ${decryptedToken}`, // ganti dengan token yang sesuai
                        },
                    });
                    
                    setNotes(response.data);
                    setNoteSearch(response.data);
                } catch (error) {
                    console.error(error);
                }
            }  
    
            fetchNotes();
        }
        else{
            async function fetchNotes() {
                try {
                    const response = await axios.post('http://localhost:5000/api/notes/getByOwner', {
                        'owner': user.email

                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${decryptedToken}`, // ganti dengan token yang sesuai
                        },
                    });
                    
                    setNotes(response.data);
                    setNoteSearch(response.data);
                } catch (error) {
                    console.error(error);
                }
            }  
    
            fetchNotes();
        }


    }, [global]);

    useEffect(() => {
        if (value === '') {
            setNoteSearch(notes);
        } else {
            setNoteSearch(notes.filter(note => note.name.toLowerCase().includes(value.toLowerCase())));
        }
    }, [value]);
    
    
    const handleDelete = async (note) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/notes/delete`, { 
                id: note._id 
            },

            {
                headers: {
                    'Authorization': `Bearer ${decryptedToken}`,
                }
            }

            );
            setNotes(notes.filter(n => n._id !== note._id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditName = async (note, name) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/notes/edit`, { 
                id: note._id,
                name: name
            },
            {
                headers: {
                    'Authorization': `Bearer ${decryptedToken}`,
                }
            }

            );
            setNotes(notes.map(n => {
                if (n._id === note._id) {
                    return { ...n, name: name };
                }
                return n;
            }));
        } catch (error) {
            console.error(error);
        }
    } 

    return (
    <div className="grid xl:grid-cols-4 md:grid-cols-3 grid-cols-1  gap-4 sm:w-4/5 w-3/4 justify-center mx-auto mt-20 mb-28">
            {noteSearch.map(note => (
                <NoteCard key={note._id} note={note} onDelete = {handleDelete} onEdit = {handleEditName} user={user} page={global}/>
            ))}
    </div>
    );
};

export default NoteContainer;