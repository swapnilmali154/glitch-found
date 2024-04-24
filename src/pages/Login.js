import React, { useEffect, useState, useContext } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { MyContext } from '../MyContextProvider';

const Login = () => {

    const { loggedUserData, updateLoggedUserData } = useContext(MyContext);

    const navigate = useNavigate();
    const [emailId, setemailId] = useState('');
    const [password, setPassword] = useState('');
    useEffect(() => {
        sessionStorage.clear();
    }, []);

    const validate = () => {
        let isValid = true;

        if (emailId === "" || password === "") {
            isValid = false;
            toast.warning("Please enter both username and password");
        }
        return isValid;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            await axios.get("https://onlinetestapi.gerasim.in/api/Glitch/GetAllUsers")
                .then((response) => {
                   
                    const users = response.data.data;
                   

                    const isUserPresent = users.find(m => m.emailId === emailId && m.password === password);
                   
                    if (isUserPresent) {
                        updateLoggedUserData(isUserPresent);
                        toast.success("Login successful");
                        sessionStorage.setItem("loginUserData", JSON.stringify(isUserPresent));
                        navigate("/user");
                    } else {
                        toast.error("Please enter valid email Id and password");
                    }
                })
                .catch((error) => {
                    toast.error("Login failed due to " + error.message);
                });
        }
    }
    return (
        <>
            <Container>
                <div className='row my-2'>
                    <div className='col-md-3'></div>
                    <div className='col-md-6'>
                        < div className="max-w-md mx-auto mx-12 py-11 bg-white rounded shadow-lg" style={{ border: '1px solid black' }}>
                            <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
                            <Form onSubmit={handleSubmit} className='px-3'>
                                <Form.Group controlId="username" className="mb-4">
                                    <Form.Label><h5>Email Id</h5></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Email Id"
                                        value={emailId}
                                        onChange={(e) => setemailId(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="password" className="mb-4">
                                    <Form.Label><h5>Password</h5></Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>



                                <div className="w-full text-center ">
                                    <Button variant="primary" type="submit" className="w-full m-2">
                                        Login
                                    </Button>
                                    <Button variant="success" className="w-full">

                                        Register

                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </Container>
        </>

    );
};

export default Login;
