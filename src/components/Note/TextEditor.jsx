import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './notes.css'
import './style.css';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { ShareModal } from '../Modals';
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { secretKey } from '../../babi';
import { jwtDecode } from 'jwt-decode';
import ResizableDraggableBox from '../Modals/ResizableDraggableBox';
import config from '../../config';
import Draw from '../Animation/draw';

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote'],
    ['code-block'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['image', 'link'],
];

function TextEditor() {
    const { id: documentId } = useParams();
    const [socket, setSocket] = useState(null);
    const [quill, setQuill] = useState(null);
    const [documentName, setDocumentName] = useState('Document');
    const [shareModal, setShareModal] = useState(false);
    const [note, setNote] = useState(null);
    const decryptedBytes = CryptoJS.AES.decrypt(Cookies.get('token'), secretKey);
    const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const jwt = jwtDecode(decryptedToken);
    const [user, setUser] = useState(jwt);
    const [commentClick, setCommentClick] = useState(false);
    const [listUserReadPermission, setListUserReadPermission] = useState([]);
    const [listUserWritePermission, setListUserWritePermission] = useState([]);
    const [documentOwner, setDocumentOwner] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        axios.post(`${config.apiUrl}/api/notes/getNoteById`, {
            'id': documentId
        },

            {
                headers: {
                    'Authorization': `Bearer ${decryptedToken}`,
                }
            }

        )
            .then(res => {
                setNote(res.data.note);
                setListUserReadPermission(res.data.note.read_access);
                setListUserWritePermission(res.data.note.write_access);
                setDocumentOwner(res.data.note.owner);

                // Set Quill access based on note's permissions
                if (res.data.note.owner === user.email) {
                    if (quill) {
                        quill.enable();
                    }
                }
                else if (res.data.note.public_access === "Anyone with the link" && res.data.note.public_permission === "Editor") {
                    if (quill) {
                        quill.enable();
                    }
                } else if (res.data.note.public_access === "Anyone with the link" && res.data.note.public_permission === "Viewer") {
                    if (res.data.note.write_access.includes(user.email)) {
                        if (quill) {
                            quill.enable();
                        }
                    } else {
                        if (quill) {
                            quill.enable(false);
                        }
                    }
                } else if (res.data.note.public_access === "Restricted") {
                    if (res.data.note.write_access.includes(user.email)) {
                        if (quill) {
                            quill.enable();
                        }
                    }
                    else if (res.data.note.read_access.includes(user.email)) {
                        if (quill) {
                            quill.enable(false);
                        }
                    }
                    else {
                        navigate('/user/home', { state: { message: 'You do not have access to this document. Email the owner for the access' } });
                    }
                }
            }).catch(err => {
                console.log(err);
            });
    }, [quill, jwt]);

    // Connect to sockets
    useEffect(() => {
        const s = io('http://localhost:3001');
        setSocket(s);

        return () => {
            s.disconnect();
        };
    }, []);

    // Send changes to sockets
    useEffect(() => {
        if (socket == null || quill == null) return;

        let isRemoteUpdate = false;

        const handleTextChange = (delta, oldDelta, source) => {
            if (source === 'user' && !isRemoteUpdate) {
                // Ambil seluruh konten dokumen dalam format JSON
                const documentContent = quill.getContents();

                // Kirim seluruh konten dokumen ke server melalui socket
                socket.emit('send-changes', documentId, documentContent);
            }
        };

        quill.on('text-change', handleTextChange);

        const handler = (delta) => {
            isRemoteUpdate = true;
            quill.setContents(delta, 'api');
            isRemoteUpdate = false;
        };

        const handlerPhone = (delta) => {
            isRemoteUpdate = true;
            quill.setContents(delta, 'api');
            isRemoteUpdate = false;
        };

        socket.on('receive-changes', handler);
        socket.on('receive-changes-phone', handlerPhone);

        return () => {
            socket.off('receive-changes', handler);
            quill.off('text-change', handleTextChange);
        };
    }, [socket, quill, documentId]);

    // Load document
    useEffect(() => {
        if (socket == null || quill == null) return;

        socket.once('load-document', (document, namaNote) => {
            quill.setContents(document);
            setDocumentName(namaNote);
        });

        socket.emit('get-document', documentId);
    }, [socket, quill, documentId]);

    // Save document
    useEffect(() => {
        if (socket == null || quill == null) return;

        const interval = setInterval(() => {
            socket.emit('save-document', documentId, documentName, user.email, quill.getContents());
        }, 2000);

        return () => {
            clearInterval(interval);
        }
    }, [socket, quill, documentName, documentId]);

    // Create the editor
    const wrapperRef = useCallback((wrapper) => {
        if (!wrapper) return;
        wrapper.innerHTML = '';
        const editor = document.createElement('div');
        wrapper.append(editor);
        const q = new Quill(editor, {
            theme: 'snow',
            modules: {
                toolbar: {
                    container: toolbarOptions,
                }
            }
        });
        setQuill(q);
    }, []);

    const inputRef = React.useRef(null);

    useEffect (() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === 'k') {
                event.preventDefault();
                inputRef.current.focus();
                
            }
        inputRef.current.focus();
        }
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    const toolbarTab = {
        width: '100%',
        margin: '0 auto',
    }

    const handleInputChange = (e) => {
        setDocumentName(e.target.value);
    }

    const handleSave = () => {
        socket.emit('save-document', documentId, documentName, quill.getContents());
    }

    const handleCommentClick = () => {
        setCommentClick(!commentClick);
    }

    const navigateToHome = () => {
        navigate('/user/home');
    }

    return (
        <>

            {shareModal ? <ShareModal onClose={() => setShareModal(false)} note={note} user={user} /> : null}
            <div className='toolbarContainer dark:!bg-gray-800 px-2'>
                <div className='toolbar bg-black dark:!bg-gray-800 !grid md:!grid-cols-5 !grid-cols-4 !gap-2'>
                    <input ref={inputRef} type="text" className='!col-span-4 md:!col-span-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' placeholder='Enter note title' style={toolbarTab} value={documentName} onChange={handleInputChange} />
                    <span style={toolbarTab} className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800' onClick={navigateToHome}>
                        <span class="text-xs sm:text-sm md:text-md !text-center w-full relative py-1 m-0.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Notes
                        </span>
                    </span>
                    <span className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800' 
                    style={toolbarTab} onClick={handleSave}>
                        <span class="text-xs sm:text-sm md:text-md !text-center w-full relative m-0.5 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Save
                        </span>
                        
                    </span>
                    <span className='relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800' 
                    style={toolbarTab} onClick={() => setShareModal(true)} >
                        <span class="text-xs sm:text-sm md:text-md !text-center w-full relative m-0.5 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Share
                        </span>
                    </span>
                    <span className='w-full relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800' 
                    style={toolbarTab} onClick={handleCommentClick}>
                        <span class="text-xs sm:text-sm md:text-md !text-center w-full relative py-1 m-0.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Comments
                        </span>
                    </span>
                </div>
            </div>

            <Draw isMoveable={false} inter={1000} maxScale={20} />

            <div className="container " ref={wrapperRef}></div>
            {commentClick ? <ResizableDraggableBox document_id={documentId} owner={user} /> : null}
        </>
    );
}

export default TextEditor;
