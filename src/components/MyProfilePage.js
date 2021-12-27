import { Avatar, Box, Button, Container, Typography, TextField } from '@mui/material';
import { useState, useEffect } from 'react'

import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { updateName, updatePhoto } from '../features/user/userInfoSlice'


import { doc, updateDoc, getFirestore, arrayUnion, arrayRemove } from "firebase/firestore";
import { app } from '../firebase'

import { fetchInfoAboutUser } from './../utils/fetchInfoAboutUser';

import NoPersonImage from '../assets/no_person.svg'

const MyProfilePage = () => {
    const [userInfo, setUserInfo] = useState({})
    const [friends, setFriends] = useState([])

    const [editingMode, setEditingMode] = useState(false)
    const [editingPhoto, setEditingPhoto] = useState("")
    const [editingName, setEditingName] = useState("")


    const currentUserInfo = useSelector((state) => state.userInfo.value)

    let id = currentUserInfo.id;
    let navigate = useNavigate();
    let dispatch = useDispatch()

    const db = getFirestore(app);

    const getFriends = async () => {
        const user = await fetchInfoAboutUser(id)
        setUserInfo(user)
        let newArr = []
        if (user && user.friends && user.friends.length !== 0) {
            for (let friendId of user.friends) {
                const friend = await fetchInfoAboutUser(friendId)
                newArr.push(friend)
            }
            setFriends(newArr)
        }
    }

    const saveEditingChanges = async () => {
        let updatedUser = userInfo
        if (editingName !== "") {
            dispatch(updateName(editingName))
            updatedUser.name = editingName
        }
        if (editingPhoto !== "") {
            dispatch(updatePhoto(editingPhoto))
            updatedUser.photoURL = editingPhoto
        }
        setUserInfo(updatedUser)

        const currentRef = doc(db, "users", userInfo.id);
        await updateDoc(currentRef, {
            name: userInfo.name,
            photoURL: userInfo.photoURL
        });

        setEditingMode(false)
        setEditingName("")
        setEditingPhoto("")
        console.log(currentUserInfo, "shit from redux")
    }

    useEffect(() => {
        getFriends()
    }, [id])

    return (
        <div>
            {userInfo && Object.keys(userInfo).length !== 0
                ?
                <Container sx={{ textAlign: "center", py: 2 }}>
                    <Avatar alt={userInfo.name} src={userInfo.photoURL ? userInfo.photoURL : NoPersonImage} sx={{ width: 128, height: 128, mx: "auto" }} />
                    {editingMode
                        ?
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <TextField value={editingPhoto} onChange={(e) => setEditingPhoto(e.target.value)} label="New image url" type="text" variant="outlined" sx={{ my: 1, mx: "auto" }}></TextField>
                            <TextField value={editingName} onChange={(e) => setEditingName(e.target.value)} label="New name" type="text" variant="outlined" sx={{ my: 1, mx: "auto" }}></TextField>
                            <Button variant="contained" color="primary" onClick={() => saveEditingChanges()}>Save changes</Button>
                        </Box>
                        : <Box> <Typography variant="h4" sx={{ py: 2 }}>{userInfo.name}</Typography>
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                {friends && friends.length > 0 ? friends.map((friend) => {
                                    return (
                                        <Box key={friend.id}>
                                            <Link to={'/profile/' + friend.id}>
                                                <Avatar alt={friend.name} src={friend.photoURL ? friend.photoURL : NoPersonImage} sx={{ width: 64, height: 64, mx: 1 }}></Avatar>
                                            </Link>
                                        </Box>
                                    )
                                }) : ""}
                            </Box>

                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <Typography variant="h6" sx={{ p: 2 }}>I have {userInfo.friends.length} {userInfo.friends.length !== 1 ? "friends" : 'friend'}</Typography>
                            </Box>
                            <Button variant="contained" color="primary" onClick={() => setEditingMode(true)}>Edit</Button>
                        </Box>}

                </Container>
                :
                <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4" sx={{ p: 2 }}>No User has been found by this id.<br /> Are you sure you're on the right page?</Typography>
                </Box>
            }

        </div>
    )
}

export default MyProfilePage
