import React, { useEffect, useRef } from 'react';
import { useState } from 'react';

const InputAuto = ({ placeholder, addViewPermission }) => {
    const emailPermissionRef = useRef(null);
    const [openSearch, setOpenSearch] = useState(false);
    const [searchEmailPermissionLocalStorage, setSearchEmailPermissionLocalStorage] = useState([]);
    const [emailValid, setEmailValid] = useState(true);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        const isiLocalStorage = localStorage.getItem('searchEmailPermission');
        if (isiLocalStorage) {
            setSearchEmailPermissionLocalStorage(JSON.parse(isiLocalStorage));
        }
        else{
            setSearchEmailPermissionLocalStorage([]);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);

    useEffect(() => {
        if (emailPermissionRef.current && highlightedIndex >= 0) {
            const selectedElement = emailPermissionRef.current.children[highlightedIndex];
            if (selectedElement) {
                selectedElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }
        }
    }, [highlightedIndex, openSearch]);

    function isValidEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowDown') {
            setHighlightedIndex((prevIndex) => 
                Math.min(prevIndex + 1, searchEmailPermissionLocalStorage.length - 1)
            );
        } else if (event.key === 'ArrowUp') {
            setHighlightedIndex((prevIndex) => 
                Math.max(prevIndex - 1, 0)
            );
        } else if (event.key === 'Enter' && highlightedIndex >= 0) {
            setSearchValue(searchEmailPermissionLocalStorage[highlightedIndex]);
            setOpenSearch(false);
        }
    };

    const handleClickOutside = (event) => {
        if (emailPermissionRef.current && !emailPermissionRef.current.contains(event.target)) {
            setOpenSearch(false);
        }
    }

    const handleSearchValueChange = (e) => {
        const newValue = e.target.value;

        if(!openSearch){
            setOpenSearch(true);
        }

        setSearchValue(newValue);

        if (newValue === '') {
            const isiLocalStorage = localStorage.getItem('searchEmailPermission');
            if (isiLocalStorage) {
                setSearchEmailPermissionLocalStorage(JSON.parse(isiLocalStorage));
            }
            else{
                setSearchEmailPermissionLocalStorage([]);
            }
        }
        else{
            setSearchEmailPermissionLocalStorage(searchEmailPermissionLocalStorage.filter((email) => email.includes(e.target.value)));
        }
    }

    const clearSearch = () => {
        setSearchValue('');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const isiLocalStorage = localStorage.getItem('searchEmailPermission');
        if (!isValidEmail(searchValue)) {
            setEmailValid(false);
            return;
        }

        if (isiLocalStorage) {
            const data = JSON.parse(isiLocalStorage);
            if (data.includes(searchValue)) {
                setSearchEmailPermissionLocalStorage(JSON.parse(isiLocalStorage));
                addViewPermission(searchValue);
                clearSearch();
                return;
            }

            if(data.length >= 5){
                data.shift();
            }

            data.push(searchValue);
            localStorage.setItem('searchEmailPermission', JSON.stringify(data));
            setSearchEmailPermissionLocalStorage(data);
            addViewPermission(searchValue);
            clearSearch();
        }
        else{
            localStorage.setItem('searchEmailPermission', JSON.stringify([searchValue]));
            setSearchEmailPermissionLocalStorage([searchValue]);
            addViewPermission(searchValue);
            clearSearch();
        }
        setOpenSearch(false);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className='w-full relative'>
                
            {emailValid ? null : <p className="text-red-500 text-xs">Email tidak valid</p>}

                <input 
                    type="text" 
                    value={searchValue} 
                    onChange={handleSearchValueChange} 
                    className="border border-gray-300 rounded p-2 w-full" 
                    placeholder={placeholder} 
                    onClick={() => {
                        if (openSearch !== true) {
                            setOpenSearch(true);
                            setSearchEmailPermissionLocalStorage(searchEmailPermissionLocalStorage.filter((email) => email.includes(searchValue)));
                        }
                    }}
                    onKeyDown={handleKeyDown}
                />

                <div ref={emailPermissionRef} className={`w-full ${openSearch ? "" : "hidden" } bg-white max-h-32 min-h-10 overflow-auto border-b border-l border-r border-gray-300 p-2 absolute`}>
                    {(searchEmailPermissionLocalStorage || []).map((email, index) => (
                        <div key={index} onClick={() => {
                                setSearchValue(email);
                                setOpenSearch(false);
                            }} className= {`flex justify-between items-center my-2 p-2 ${index === highlightedIndex ? 'bg-gray-100' : ''}`}
                            onMouseEnter={() => setHighlightedIndex(index)} >
                            <p>{email}</p>
                        </div>
                    ))}
                </div>
            </div>
            
            
        </form>
    );
}

export default InputAuto;
