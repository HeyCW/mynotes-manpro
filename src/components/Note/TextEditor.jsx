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
    const [user, setUser] = useState(
        Cookies.get('token') ? jwt : null || 
        axios.post('http://localhost:5000/api/auth/re', {
        
        })
    );

    const [commentClick, setCommentClick] = useState(false);
    const [listUserReadPermission, setListUserReadPermission] = useState([]);
    const [listUserWritePermission, setListUserWritePermission] = useState([]);
    const [documentOwner, setDocumentOwner] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        // console.log(user);
        axios.post('http://localhost:5000/api/notes/getNoteById', {
            'id': documentId
            })
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
                        navigate('/user/home');
                    }
                }
            }).catch(err => {
                console.log(err);
            });
    }, [quill]);

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
                socket.emit('send-changes', documentId, delta);
            }
        };

        quill.on('text-change', handleTextChange);

        const handler = (delta) => {
            isRemoteUpdate = true;
            quill.updateContents(delta, 'api');
            isRemoteUpdate = false;
        };

        socket.on('receive-changes', handler);

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
        if (!wrapper ) return;
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


    const toolbarTab = {
        width: '20%',
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

            {shareModal ? <ShareModal onClose={()=>setShareModal(false)} note={note} user={user}/> : null}
            <div className='toolbarContainer'>
                <div className='toolbar'>
                    <span style={toolbarTab} onClick={navigateToHome}>Notes</span>
                    <input type="text" style={toolbarTab} value={documentName} onChange={handleInputChange} />
                    <div style={toolbarTab} onClick={handleSave}>Save</div>
                    <div style={toolbarTab} onClick={()=>setShareModal(true)} >Share</div>
                    <div style={toolbarTab} onClick={handleCommentClick}>Comment</div>
                </div>
            </div>
            
            <div className="container" ref={wrapperRef}></div>
            { commentClick ? <ResizableDraggableBox document_id={documentId} owner={user}/> : null }
        </>
    );
}

export default TextEditor;
