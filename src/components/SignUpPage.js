import { useState } from 'react'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { app } from '../firebase'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { useDispatch } from 'react-redux'
import { setLoggedIn } from '../features/user/isLoggedSlice'
import { setUserInfo } from '../features/user/userInfoSlice'

import { useNavigate } from "react-router-dom";

import { validateEmail } from './../utils/validateEmail';

const SignUpPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmedPassword, setConfirmedPassword] = useState("")

    const auth = getAuth(app);

    const dispatch = useDispatch()
    let navigate = useNavigate();


    return (
        <div>
            <Container maxWidth="xl" sx={{ textAlign: 'center' }}>
                <Typography
                    variant="h2"
                    sx={{ mx: "auto", my: 2 }}
                >
                    Sign Up
                </Typography>
                <Box sx={{ my: 2, display: "flex", flexDirection: "column" }}>
                    <TextField required value={email} onChange={(e) => setEmail(e.target.value)} id="outlined-basic" label="Email" type="mail" variant="outlined" sx={{ my: 1, mx: "auto" }} />
                    <TextField required value={password} onChange={(e) => setPassword(e.target.value)} id="outlined-basic" label="Password" type="password" variant="outlined" sx={{ my: 1, mx: "auto" }} />
                    <TextField required value={confirmedPassword} onChange={(e) => setConfirmedPassword(e.target.value)} id="outlined-basic" label="Confirm password" type="password" variant="outlined" sx={{ my: 1, mx: "auto" }} />
                </Box>
                <Button variant="contained" color="primary" sx={{ my: 1, display: "block", mx: "auto" }} onClick={() => {
                    if (password !== confirmedPassword) {
                        alert('Passwords do not match. Try again')
                    } else if (!validateEmail(email)) {
                        alert('Please, input correct email')
                    } else if (password.length < 5) {
                        alert('Please, input correct password')
                    } else if (password === "" || email === "" || confirmedPassword === "") {
                        alert('Please, input all data')
                    } else {
                        createUserWithEmailAndPassword(auth, email, password)
                            .then((userCredential) => {
                                // Signed in 
                                const user = userCredential.user;
                                // ...
                                dispatch(setLoggedIn())
                                dispatch(setUserInfo(user))
                                navigate('/')
                            })
                            .catch((error) => {
                                const errorCode = error.code;
                                const errorMessage = error.message;
                                // ..
                            });
                    }
                }}>Sign Up</Button>
            </Container>
        </div >
    )
}

export default SignUpPage
