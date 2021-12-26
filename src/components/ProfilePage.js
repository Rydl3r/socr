import { Avatar, Box, Button, Container, Typography } from '@mui/material';
import { useState, useEffect } from 'react'

import { useParams, useNavigate, Link } from "react-router-dom";

import { fetchInfoAboutUser } from './../utils/fetchInfoAboutUser';

import NoPersonImage from '../assets/no_person.svg'

const ProfilePage = () => {
    const [userInfo, setUserInfo] = useState({})
    const [friends, setFriends] = useState([])

    let { id } = useParams();
    let navigate = useNavigate();

    const getFriends = async () => {
        const user = await fetchInfoAboutUser(id)
        setUserInfo(user)
        let newArr = []
        if (user.friends.length !== 0) {
            for (let friendId of user.friends) {
                const friend = await fetchInfoAboutUser(friendId)
                newArr.push(friend)
            }
            setFriends(newArr)
        }

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
                    <Typography variant="h4" sx={{ py: 2 }}>{userInfo.name}</Typography>
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
                        <Typography variant="h6" sx={{ p: 2 }}>This user has {userInfo.friends.length} {userInfo.friends.length !== 1 ? "friends" : 'friend'}</Typography>
                        <Link to="/">
                            <Button variant="contained" sx={{ m: 2 }}>Send Request</Button>
                        </Link>
                    </Box>
                </Container>
                :
                ""
            }

        </div>
    )
}

export default ProfilePage
