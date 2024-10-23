import { set } from 'mongoose';
import React, { useState, useEffect, useRef } from 'react';
import ProfilePicture from '../ProfilePicture';
import axios from 'axios';
import CommentBox from '../CommentBox';
import { IoSend } from "react-icons/io5";

export default function ResizableDraggableBox({document_id, owner}) {

    const [size, setSize] = useState(5);
    const [click, setClick] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const containerRef = useRef(null);

    const onClick = () => {

        if (click) {
            setSize((prevSize) => prevSize - 60);
        }
        else {
            setSize((prevSize) => prevSize + 60); 
        }
        
        setClick(!click);
    }

    const sendClick = () => {
        axios.post('http://localhost:5000/api/comments/add', {
            'document_id': document_id,
            'owner': owner['name'],
            'comment': commentContent
        }).then(res => {
            console.log(res);
            setComments([...comments, res.data]);
        }).catch(err => {
            console.log(err);
        });

        setCommentContent('');
    }

    const handleCommentContentChange = (e) => {
        setCommentContent(e.target.value);
    }

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/comments/get');
                setComments(res.data);
            } catch (err) {
                console.error('Error fetching comments:', err);
            }
        };

        fetchComments();
    }, []);
    

    return (
        <>
            <div className='draggable-box w-full' style={{ height: `${size}vh` }} ref={containerRef}>
                <div className='w-full flex justify-center mb-10'>
                    <div className='bg-gray-300 w-1/3 absolute h-[24px] rounded-lg text-center font-bold' onClick={onClick}>
                        Click
                    </div>
                </div>

                <div className='h-[80%] overflow-y-auto'>
                    {comments.map(comment => (
                        <>
                            <CommentBox owner={comment.owner} date={comment.date} content={comment.comment}/>
                        </>
                        
                    ))}
                </div>
                

                {click ? 

                <div className="sticky bottom-0 bg-white p-2 border-t-2">
                    <div className='flex p-3'>
                        <input type="text" className='border-2 h-8 rounded-lg p-2 w-full' placeholder='Type your comment' value={commentContent} onChange={handleCommentContentChange}/>
                        
                        <div className='p-2' onClick={sendClick}>
                            <IoSend/>
                        </div>
                    </div>
                </div> 
                
                : null}
                
            </div>
        </>
        
    );
}