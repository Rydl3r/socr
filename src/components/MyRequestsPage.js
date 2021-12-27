import { Avatar, Box, Button, Container, Typography, Card } from '@mui/material';
import NoPersonImage from '../assets/no_person.svg'

import { useSelector, useDispatch } from 'react-redux'
import { deleteRequest, addFriend } from '../features/user/userInfoSlice'

import { useState, useEffect } from 'react'
import { Link } from "react-router-dom";

import { doc, updateDoc, getFirestore, arrayUnion, arrayRemove } from "firebase/firestore";
import { app } from '../firebase'

import { fetchInfoAboutUser } from './../utils/fetchInfoAboutUser';



const MyRequestsPage = () => {
    const [requestsUsers, setRequestsUsers] = useState([])

    const requests = useSelector((state) => state.userInfo.value.requests)
    const currentUser = useSelector((state) => state.userInfo.value)

    let dispatch = useDispatch()

    const db = getFirestore(app);

    const fetchRequestsUsers = async () => {
        let newArr = []
        setRequestsUsers([])
        if (requests && requests.length !== 0) {
            for (let request of requests) {
                const user = await fetchInfoAboutUser(request)
                newArr.push(user)
            }
            setRequestsUsers(newArr)
        }
    }

    const acceptFriend = async (acceptedId) => {
        const currentRef = doc(db, "users", currentUser.id);
        await updateDoc(currentRef, {
            friends: arrayUnion(acceptedId),
            requests: arrayRemove(acceptedId)
        });
        const newFriendRef = doc(db, "users", acceptedId);
        await updateDoc(newFriendRef, {
            friends: arrayUnion(currentUser.id),
            sentRequests: arrayRemove(currentUser.id)
        });
        dispatch(deleteRequest(acceptedId))
        dispatch(addFriend(acceptedId))
        console.log(requestsUsers, requests, currentUser, "shitadd")
        let newArr = requestsUsers.filter((requestsUser) => requestsUser.id !== acceptedId)
        setRequestsUsers(newArr)

    }

    const rejectFriend = async (acceptedId) => {
        const currentRef = doc(db, "users", currentUser.id);
        await updateDoc(currentRef, {
            requests: arrayRemove(acceptedId)
        });
        const newFriendRef = doc(db, "users", acceptedId);
        await updateDoc(newFriendRef, {
            sentRequests: arrayRemove(currentUser.id)
        });
        dispatch(deleteRequest(acceptedId))
        console.log(requests, currentUser, "shitdel")
        let newArr = requestsUsers.filter((requestsUser) => requestsUser.id !== acceptedId)
        setRequestsUsers(newArr)
    }

    useEffect(() => {
        fetchRequestsUsers()
    }, [])

    return (
        <Box sx={{ textAlign: "center", p: 2 }}>
            {requests && requestsUsers && requests.length > 0 && requestsUsers.length > 0
                ? <Box>
                    <Typography variant="h4" sx={{ p: 2 }}>Your friends requests</Typography>
                    <Box>
                        {requestsUsers.map((user) => (
                            <Card key={user.id} variant="outlined" sx={{ p: 2 }}>
                                <Link to={'/profile/' + user.id} sx={{ mx: 2 }}>
                                    <Avatar alt={user.name} src={user.photoURL ? user.photoURL : NoPersonImage} sx={{ width: 64, height: 64, mx: "auto" }}></Avatar>
                                    <Typography>{user.name}</Typography>
                                </Link>
                                <Button sx={{ mx: 2 }} variant="contained" color="success" onClick={() => acceptFriend(user.id)}>Accept</Button>
                                <Button sx={{ mx: 2 }} variant="contained" color="error" onClick={() => rejectFriend(user.id)}>Decline</Button>
                            </Card>
                        ))}
                    </Box>
                </Box>
                : <Typography variant="h4" sx={{ p: 2 }}>No requests found! Try adding new friends yourself!</Typography>
            }
        </Box>
    )
}

export default MyRequestsPage
