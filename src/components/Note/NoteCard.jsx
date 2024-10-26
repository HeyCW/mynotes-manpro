import React, { useCallback, useState, useRef, useEffect } from 'react';
import Quill from 'quill';
import { HiDotsVertical } from 'react-icons/hi';
import './note_card.css'; 
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { GoShareAndroid } from "react-icons/go";
import {EditModal, ShareModal} from '../Modals';

const NoteCard = ({ note, onDelete, onEdit, user, page }) => {
    const menuRef = useRef(null);
    const [showMenu, setShowMenu] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [shareModal, setShareModal] = useState(false);

    // ========= Menu =============
    // Handle menu click
    const handleMenu = () => {
        setShowMenu(prev => !prev);
    };

    // Handle click outside of menu
    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setShowMenu(false);
        }
    };

    // ========= Delete Menu =============
    // Handle delete note
    const handleDelete = async () => {
        await onDelete(note);
    }

    // ========= Edit Menu =============
    // Handle edit note
    const handleEdit = async (note, name) => {
        await onEdit(note, name);
    }

    // ========= Edit Modal =============
    const openEditModal = () => {  
        setEditModal(true);
        setShowMenu(false);
    }

    const closeEditModal = () => {
        setEditModal(false);
    }

    // ========= Share Modal =============
    const openShareModal = () => {
        console.log('Share');
        setShareModal(true);
        setShowMenu(false);
    }

    const closeShareModal = () => {
        console.log('Close Share');
        setShareModal(false);
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const wrapperRef = useCallback((wrapper) => {
        if (!wrapper) return;
        wrapper.innerHTML = '';
        const editor = document.createElement('div');
        wrapper.append(editor);
        const q = new Quill(editor, { 
            theme: 'snow',
            readOnly: true,
            modules: {
                toolbar: false
            }
        });
        q.disable();
        q.setContents(note.data);
    }, [note.data]);

    return (
        <div className="note-card shadow-lg relative bg-white">
            {editModal && <EditModal note = {note} onClose={closeEditModal} onEdit = {handleEdit}/>}
            {shareModal && <ShareModal note = {note} onClose={closeShareModal} user={user}/>}
            <div className="note-card-content">
                <a href={`/user/note/${note._id}`} className="">
                    <div className="note-card-image h-64 border-b border-black" ref={wrapperRef}></div>
                </a>
                <div className="note-card-body p-6 text-surface dark:text-white">
                    <h5 className="note-card-title mb-10 text-xl font-medium text-black overflow-hidden">{note.name}</h5>
                    
                    <div className='flex justify-between'>
                        
                        {note.public_access === "Restricted" ? <div className="text-red-500 text-sm">Need Access</div> : <div className="text-green-500 text-sm">Open for public</div>}

                        {page === true ? <HiDotsVertical 
                        className="text-black z-10 three-dot-icon" onClick={handleMenu}/> : null}

                        {showMenu && (
                            <div 
                            ref={menuRef}
                            className="absolute left-[85%] mt-5 w-48 py-2 bg-white border border-gray-200 rounded-md shadow-xl z-20 overflow-visible">
                                <div onClick={openEditModal} className='flex justify-between hover:bg-gray-100 cursor-pointer'>
                                    <div  className="block px-4 py-2 text-sm text-gray-700">Edit</div>
                                    <CiEdit className='text-black w-16 mt-3'/>
                                </div>
                                <div onClick={handleDelete} className='flex justify-between hover:bg-gray-100 cursor-pointer'>
                                    <div  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Delete</div>
                                    <MdDeleteOutline className='text-black w-16 mt-3'/>
                                </div>

                                <div onClick={openShareModal}  className='flex justify-between hover:bg-gray-100 cursor-pointer'>
                                    <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Share</div>
                                    <GoShareAndroid className='text-black w-16 mt-3'/>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default NoteCard;
