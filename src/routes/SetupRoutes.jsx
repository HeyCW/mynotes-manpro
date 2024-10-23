import React from 'react';
import {Route, BrowserRouter, Routes, Navigate} from 'react-router-dom';
import {Layout,Home, About, CreateNote, Login} from '../pages/user';
import ProtectedRoutes from './ProtectedRoutes';
import Register from '../pages/user/Register';

const SetupRoutes = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route>
                    <Route path="/" element={<Navigate to="/login"/>}/>
                    <Route path="/login" element={<Login />}/>
                    <Route path='/register' element={<Register/>}/>
                    <Route path="/" >
                        <Route path="user" element={<Layout />}>
                        <Route 
                            path="home" 
                            element={<ProtectedRoutes element={<Home />}/>} 
                        />
                            <Route path="about" element={<About />} />
                        </Route>
                    </Route>
                    <Route path="/user/note/:id" element = {<CreateNote/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default SetupRoutes;