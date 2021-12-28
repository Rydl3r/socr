import { useState } from 'react'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { app } from '../firebase'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

import { useDispatch } from 'react-redux'
import { setLoggedIn } from '../features/user/isLoggedSlice'
import { setUserInfo } from '../features/user/userInfoSlice'

import { useNavigate } from "react-router-dom";

import { validateEmail } from './../utils/validateEmail';

const SignUpPage = () => {
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [password, setPassword] = useState("")
    const [confirmedPassword, setConfirmedPassword] = useState("")

    const auth = getAuth(app);
    const db = getFirestore(app);

    const dispatch = useDispatch()
    let navigate = useNavigate();


    return (
        <div>
            <Container maxWidth="xl" sx={{ textAlign: 'center' }}>
                <Typography
                    variant="h2"
                    sx={{ mx: "auto", pt: 2 }}
                >
                    Sign Up
                </Typography>
                <Box sx={{ my: 2, display: "flex", flexDirection: "column" }}>
                    <Box sx={{ my: 1, display: "flex", justifyContent: "center" }}>
                        <TextField required value={email} onChange={(e) => setEmail(e.target.value)} id="outlined-basic" label="Email" type="mail" variant="outlined" sx={{ my: 1, mx: 1 }} />
                    </Box>
                    <Box sx={{ my: 1, display: "flex", justifyContent: 'center' }}>
                        <TextField required value={name} onChange={(e) => setName(e.target.value)} id="outlined-basic" label="Name" type="text" variant="outlined" sx={{ my: 1, mx: 1 }} />
                        <TextField required value={surname} onChange={(e) => setSurname(e.target.value)} id="outlined-basic" label="Surname" type="text" variant="outlined" sx={{ my: 1, mx: 1 }} />
                    </Box>
                    <Box sx={{ my: 1, display: "flex", justifyContent: 'center' }}>
                        <TextField required value={password} onChange={(e) => setPassword(e.target.value)} id="outlined-basic" label="Password" type="password" variant="outlined" sx={{ my: 1, mx: 1 }} />
                        <TextField required value={confirmedPassword} onChange={(e) => setConfirmedPassword(e.target.value)} id="outlined-basic" label="Confirm password" type="password" variant="outlined" sx={{ my: 1, mx: 1 }} />
                    </Box>
                </Box>
                <Button variant="contained" color="primary" sx={{ my: 1, display: "block", mx: "auto" }} onClick={() => {
                    if (password !== confirmedPassword) {
                        alert('Passwords do not match. Try again')
                    } else if (!validateEmail(email)) {
                        alert('Please, input correct email')
                    } else if (password.length < 5) {
                        alert('Please, input correct password')
                    } else if (password === "" || email === "" || name === "" || confirmedPassword === "") {
                        alert('Please, input all data')
                    } else {
                        createUserWithEmailAndPassword(auth, email, password)
                            .then((userCredential) => {
                                // Signed in 
                                const user = userCredential.user;
                                const createdUser = {
                                    id: user.uid,
                                    email: email,
                                    name: name + " " + surname,
                                    description: "I am super secret about myself, that's the only description you get for now)",
                                    photoURL: null,
                                    friends: [],
                                    requests: [],
                                    sentRequests: [],
                                }
                                // ...
                                setDoc(doc(db, "users", user.uid), createdUser);
                                dispatch(setLoggedIn())
                                dispatch(setUserInfo(createdUser))
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
