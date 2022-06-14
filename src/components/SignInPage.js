import { useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import LoginIcon from "@mui/icons-material/Login";
import GoogleIcon from "@mui/icons-material/Google";

import { app } from "../firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

import { useDispatch } from "react-redux";
import { setLoggedIn } from "../features/user/isLoggedSlice";
import { setUserInfo } from "../features/user/userInfoSlice";

import { useNavigate } from "react-router-dom";

import { validateEmail } from "./../utils/validateEmail";
import { fetchInfoAboutUser } from "../utils/fetchInfoAboutUser";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const db = getFirestore(app);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const dispatch = useDispatch();
  let navigate = useNavigate();

  return (
    <div>
      <Container maxWidth="xl" sx={{ textAlign: "center" }}>
        <Typography variant="h2" sx={{ mx: "auto", py: 2 }}>
          Sign in
        </Typography>
        <Box sx={{ my: 2, display: "flex", flexDirection: "column" }}>
          <TextField
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="outlined-basic"
            label="Email"
            type="email"
            variant="outlined"
            sx={{ my: 1, mx: "auto" }}
          />
          <TextField
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="outlined-basic"
            label="Password"
            type="password"
            variant="outlined"
            sx={{ my: 1, mx: "auto" }}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ my: 1, mx: "auto", display: "flex" }}
          onClick={() => {
            if (password === "" || email === "") {
              alert("Please, input correct data");
            } else if (!validateEmail(email)) {
              alert("Please, input correct email");
            } else {
              signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                  // Signed in
                  const user = userCredential.user;
                  // ...
                  fetchInfoAboutUser(user.uid).then((userInfo) => {
                    dispatch(setLoggedIn());
                    dispatch(setUserInfo(userInfo));
                    navigate("/");
                  });
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          }}
        >
          <LoginIcon sx={{ pr: 1 }}></LoginIcon>Sign in
        </Button>
        <Button
          variant="contained"
          color="success"
          sx={{ my: 1, mx: "auto", display: "flex" }}
          onClick={() => {
            signInWithPopup(auth, provider)
              .then((result) => {
                const user = result.user;
                const isNewUser =
                  user.metadata.creationTime === user.metadata.lastSignInTime;

                let createdUser = {};

                if (isNewUser) {
                  createdUser = {
                    id: user.uid,
                    email: user.email,
                    name: user.displayName,
                    description:
                      "I am super secret about myself, that's the only description you get for now)",
                    photoURL: user.photoURL,
                    friends: [],
                    requests: [],
                    sentRequests: [],
                  };
                  // ...
                  setDoc(doc(db, "users", user.uid), createdUser);
                  dispatch(setLoggedIn());
                  dispatch(setUserInfo(createdUser));
                  navigate("/");
                } else {
                  fetchInfoAboutUser(user.uid).then((userInfo) => {
                    dispatch(setLoggedIn());
                    dispatch(setUserInfo(userInfo));
                    navigate("/");
                  });
                }
                // ...
              })
              .catch((error) => {
                console.log(error);
              });
          }}
        >
          <GoogleIcon sx={{ pr: 1 }}></GoogleIcon>Sign in with Google
        </Button>
      </Container>
    </div>
  );
};

export default SignInPage;
