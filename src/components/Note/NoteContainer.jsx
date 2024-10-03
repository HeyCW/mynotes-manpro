import NoteCard from "./NoteCard";
import axios from "axios";
import { useEffect, useState } from "react";

const NoteContainer = ({user}) => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        // Call an api for fetching notes
        async function fetchNotes() {
            try {
                const response = await axios.get('http://localhost:5000/api/notes');
                setNotes(response.data);
            } catch (error) {
                console.error(error);
            }
        }  

        fetchNotes();
    }, []);

    useEffect(() => {
        console.log(notes);
    }, [notes]); 
    
    
    const handleDelete = async (note) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/notes/delete`, { 
                id: note._id 
            });
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
            });
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
            {notes.map(note => (
                <NoteCard key={note._id} note={note} onDelete = {handleDelete} onEdit = {handleEditName} user={user}/>
            ))}
    </div>
    );
};

export default NoteContainer;