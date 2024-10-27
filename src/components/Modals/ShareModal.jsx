import { ImCross } from "react-icons/im";
// import BlueButton from "../BlueButton";
import { FaLock } from "react-icons/fa";
import DropDown from "../DropDown";
import { useEffect, useState } from "react";
import { FaEarthAmericas } from "react-icons/fa6";
import axios from "axios";
import ProfilePicture from "../ProfilePicture";
import InputAuto from "../InputAuto";
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { secretKey } from '../../babi';
import config from "../../config";


const ShareModal = ({onClose, note, user}) => {
    const [selected, setSelected] = useState('Restricted');
    const [currentNote, setCurrentNote] = useState(note);
    const [permission, setPermission] = useState('Viewer');
    const [listUserReadPermission, setListUserReadPermission] = useState([]);
    const [listUserWritePermission, setListUserWritePermission] = useState([]);
    const [email, setEmail] = useState('');
    const [shouldRerender, setShouldRerender] = useState(false);
    const token = Cookies.get('token');
    const decryptedBytes = CryptoJS.AES.decrypt(token, secretKey);
    const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8);

    useEffect(() => {
        
        if (note) {
            axios.post(`${config.apiUrl}/api/notes/getNoteById`, {
                'id': note._id
            }, {
                headers: {
                    'Authorization': `Bearer ${decryptedToken}`,
                }
            })
            .then(res => {
                setSelected(res.data.note.public_access);
                setPermission(res.data.note.public_permission);
                setCurrentNote(res.data.note);
                setListUserReadPermission(res.data.note.read_access);
                setListUserWritePermission(res.data.note.write_access);

            })
            .catch(err => {
                console.log(err);
            });
        }

        document.body.classList.add('no-scroll');

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [note, shouldRerender]);


    const handleSelected = (value) => {
        setSelected(value);
        axios.post(`${config.apiUrl}/api/notes/changePublicAccess`, {
            id: currentNote._id,
            access: value
        }, 
        {
            headers: {
                'Authorization': `Bearer ${decryptedToken}`,
            }
        }
    ).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
       
    }

    const handlePermission = (value) => {
        setPermission(value);
        axios.post(`${config.apiUrl}/api/notes/changePublicPermission`, {
            id: currentNote._id,
            public_permission: value
        },
        {
            headers: {
                'Authorization': `Bearer ${decryptedToken}`,
            }
        }
    
        ).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });

    }

    const handleReadWritePermission = (value) => {
        changeReadWritePermission(email, value);
    }

    const changeReadWritePermission = (email, permission) => {
        if (permission === 'Viewer') {
            setListUserReadPermission([...listUserReadPermission, email]);

            axios.post(`${config.apiUrl}/api/notes/addReadAccess`, {
                id: currentNote._id,
                email: email
            },

            {
                headers: {
                    'Authorization': `Bearer ${decryptedToken}`,
                }
            }
        
            ).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            });

            setListUserWritePermission(listUserWritePermission.filter((user) => user !== email));

            axios.post(`${config.apiUrl}/api/notes/removeWriteAccess`, {
                id: currentNote._id,
                email: email
            },

            {
                headers: {
                    'Authorization': `Bearer ${decryptedToken}`,
                }
            }

            ).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            });

        } else {
            setListUserWritePermission([...listUserWritePermission, email]);

            axios.post(`${config.apiUrl}/api/notes/addWriteAccess`, {
                id: currentNote._id,
                email: email
            },

            {
                headers: {
                    'Authorization': `Bearer ${decryptedToken}`,
                }
            }
        

            ).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            });

            setListUserReadPermission(listUserReadPermission.filter((user) => user !== email));

            axios.post(`${config.apiUrl}/api/notes/removeReadAccess`, {
                id: currentNote._id,
                email: email
            },

            {
                headers: {
                    'Authorization': `Bearer ${decryptedToken}`,
                }
            }
        
        
            ).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            });
        }
    }

    const handleAddEmailReadUser = (email) => {
        axios.post(`${config.apiUrl}/api/notes/addReadAccess`, {
            id: currentNote._id,
            email: email
        },

        {
            headers: {
                'Authorization': `Bearer ${decryptedToken}`,
            }
        }
    
        ).then(res => {
            console.log(res);
            setShouldRerender(!shouldRerender);
        }).catch(err => {
            console.log(err);
        });
    }
    
    return (
        <div className={`fixed inset-0 bg-black bg-opacity-10 z-50 flex justify-center items-center`}>
            <div className="bg-white xl:w-1/3 lg:w-1/2 md:w-3/5 w-5/6 p-4 rounded-lg">
                <div className="flex sm:flex-row justify-between items-center mb-5 w-full">
                    <h1 className="text-xl font-bold">Bagikan "{currentNote.name}"</h1>
                    <ImCross className="" onClick={onClose}/>
                </div>
                <div className="w-full mb-5">
                    <InputAuto placeholder="Tambahkan orang"  addViewPermission = {handleAddEmailReadUser}/>    
                </div>
                <h1 className="text-lg font-semibold mb-5">Orang yang memiliki akses</h1>

                <div className="max-h-60 overflow-y-auto mb-3">

                {
                    user.email === note.owner ? 
                    <div className="flex items-center mb-5">
                        <ProfilePicture user={user}/>
                        <div className="flex justify-between w-full">
                            <div className="ml-5">
                                <h1 className="md:text-lg font-semibold text-xs">{user.email}</h1>
                                <p className="md:text-md text-[0.70rem] text-gray-500"> 
                                    {user.email}
                                </p>
                            </div>
                            <p className="text-gray-500 mr-3"> Pemilik </p>
                        </div>
                    </div>

                    :

                    <div className="flex items-center mb-5">
                        <ProfilePicture url ="https://www.freeiconspng.com/uploads/am-a-19-year-old-multimedia-artist-student-from-manila--21.png"/>
                        <div className="flex justify-between w-full">
                            <div className="ml-5">
                                <h1 className="md:text-lg font-semibold text-xs">{user.email}</h1>
                                <p className="md:text-md text-[0.70rem] text-gray-500"> 
                                    {user.email}
                                </p>
                            </div>
                            <p className="text-gray-500 mr-3"> Pemilik </p>
                        </div>
                    </div>
                    
                }

                {

                    listUserWritePermission.map((user, index) => {
                        return (
                            <div className="flex items-center mb-5" key={index} onClick={() => setEmail(user)}>
                                <ProfilePicture url ="https://www.freeiconspng.com/uploads/am-a-19-year-old-multimedia-artist-student-from-manila--21.png"/>
                                <div className="flex justify-between w-full">
                                    <div className="ml-5">
                                        <h1 className="md:text-lg font-semibold text-xs" >{user}</h1>
                                        <p className="md:text-md text-[0.70rem] text-gray-500"> 
                                            {user}
                                        </p>
                                    </div>
                                    <DropDown options={['Viewer', 'Editor']}  selected={"Editor"} onSelected={handleReadWritePermission}/>
                                </div>
                            </div>
                        )
                    })
                }

                {
                    listUserReadPermission.map((user, index) => {
                        return (
                            <div className="flex items-center mb-5" key={index} onClick={() => setEmail(user)}>
                                <ProfilePicture url ="https://www.freeiconspng.com/uploads/am-a-19-year-old-multimedia-artist-student-from-manila--21.png"/>
                                <div className="flex justify-between w-full">
                                    <div className="ml-5">
                                        <h1 className="md:text-lg font-semibold text-xs">{user}</h1>
                                        <p className="md:text-md text-[0.70rem] text-gray-500"> 
                                            {user}
                                        </p>
                                    </div>
                                    <DropDown options={['Viewer', 'Editor']}  selected={"Viewer"} onSelected={handleReadWritePermission}/>
                                </div>
                            </div>
                        )
                    })
                }
                    
                </div>

                <div className="border-t-2 mb-5">
                </div>

                <h1 className="text-lg font-semibold mb-5">Akses</h1>
                <div className="flex items-center mb-5">
                    <div className={`w-12 h-12 ${selected === 'Restricted' ? 'bg-gray-200' : 'bg-green-400'} rounded-full`}>
                        {selected === 'Restricted' ? <FaLock className="w-12 mt-4"/> : <FaEarthAmericas className="w-12 mt-4"/>}
                    </div>

                    <div className={`${selected === 'Restricted' ? '' : 'sm:flex justify-between w-full' }`}>
                        <div className="flex-col ml-5">
                            <DropDown options={['Restricted', 'Anyone with the link']} selected={selected} onSelected={handleSelected}/>
                            <div className="">
                                <p className="text-gray-500"> 
                                    {selected === 'Restricted' ? 'Only people added can access' : 'Anyone with the link can access'}
                                </p>
                            </div>
                        </div>

                        {selected === 'Restricted' ? '' :  
                            <div className="mt-4 ml-4">
                                <DropDown options={['Viewer','Editor']} selected={permission} onSelected={handlePermission}/>
                            </div>
                        }
                        
                    </div>
                </div>
            </div>
        </div>
    );

}

export default ShareModal;