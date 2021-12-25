import { useState } from 'react'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { app } from '../firebase'
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { useDispatch } from 'react-redux'
import { setLoggedIn } from '../features/user/isLoggedSlice'
import { setUserInfo } from '../features/user/userInfoSlice'

import { useNavigate } from "react-router-dom";

import { validateEmail } from './../utils/validateEmail';

const SignInPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    const dispatch = useDispatch()
    let navigate = useNavigate();



    return (
        <div>
            <Container maxWidth="xl" sx={{ textAlign: 'center' }}>
                <Typography
                    variant="h2"
                    sx={{ mx: "auto", my: 2 }}
                >
                    Sign in
                </Typography>
                <Box sx={{ my: 2, display: "flex", flexDirection: "column" }}>
                    <TextField required value={email} onChange={(e) => setEmail(e.target.value)} id="outlined-basic" label="Email" type="email" variant="outlined" sx={{ my: 1, mx: "auto" }} />
                    <TextField required value={password} onChange={(e) => setPassword(e.target.value)} id="outlined-basic" label="Password" type="password" variant="outlined" sx={{ my: 1, mx: "auto" }} />
                </Box>
                <Button variant="contained" color="primary" sx={{ my: 1, display: "block", mx: "auto" }} onClick={() => {
                    if (password === "" || email === "") {
                        alert('Please, input correct data')
                    } else if (!validateEmail(email)) {
                        alert('Please, input correct email')
                    } else {
                        signInWithEmailAndPassword(auth, email, password)
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
                            });
                    }

                }}>Sign in</Button>
                <Button variant="contained" color="success" sx={{ my: 1, display: "block", mx: "auto" }} onClick={() => {
                    signInWithPopup(auth, provider)
                        .then((result) => {
                            // This gives you a Google Access Token. You can use it to access the Google API.
                            const credential = GoogleAuthProvider.credentialFromResult(result);
                            const token = credential.accessToken;
                            // The signed-in user info.
                            const user = result.user;

                            dispatch(setLoggedIn())
                            dispatch(setUserInfo(user))
                            navigate('/')
                            // ...
                        }).catch((error) => {
                            // Handle Errors here.
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            // The email of the user's account used.
                            const email = error.email;
                            // The AuthCredential type that was used.
                            const credential = GoogleAuthProvider.credentialFromError(error);
                            // ...
                        });
                }}>Sign in with Google</Button>
            </Container>
        </div>
    )
}

export default SignInPage
