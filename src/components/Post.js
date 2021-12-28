import { Box, Card, CardMedia, CardHeader, CardContent, Avatar, Typography, Button, TextField } from "@mui/material"
import { useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { addLike, addComment } from '../features/posts/postsSlice'


import { app } from '../firebase'
import { doc, updateDoc, getFirestore, arrayUnion, arrayRemove } from "firebase/firestore";

import NoPersonImage from '../assets/no_person.svg'

import { fetchInfoAboutUser } from './../utils/fetchInfoAboutUser';


const Post = (props) => {
    const [author, setAuthor] = useState({})
    const [commentsData, setCommentsData] = useState([])
    const [addingComment, setAddingComment] = useState([])
    const [currentLikes, setCurrentLikes] = useState(props.data.likes.length)

    const currentUserInfo = useSelector((state) => state.userInfo.value)
    const currentIsLogged = useSelector((state) => state.isLogged.value)

    const dispatch = useDispatch()
    const db = getFirestore(app)


    const fetchAuthor = async () => {
        const authorData = await fetchInfoAboutUser(props.data.author)
        setAuthor(authorData)
    }

    const mapComments = async () => {
        let newArr = []
        for (let comment of props.data.comments) {
            let commentInfo = {}
            commentInfo = await fetchInfoAboutUser(comment.author)
            let merged = { ...{ content: comment.content, publishedAt: comment.publishedAt }, ...commentInfo };
            newArr.push(merged)
        }
        setCommentsData(newArr)
    }

    const likePost = async () => {
        if (currentIsLogged === true) {
            const currentRef = doc(db, "posts", props.data.id);
            await updateDoc(currentRef, {
                likes: arrayUnion(currentUserInfo.id)
            });
            dispatch(addLike({ likeAuthor: currentUserInfo.id, postId: props.data.id }))
            setCurrentLikes(currentLikes + 1)
        } else {
            alert('Please, login!')
        }
    }

    const addComment = async () => {
        if (currentIsLogged === true) {
            let newDate = new Date().toLocaleString()
            const currentRef = doc(db, "posts", props.data.id);
            await updateDoc(currentRef, {
                comments: arrayUnion({
                    author: currentUserInfo.id,
                    content: addingComment,
                    publishedAt: newDate
                }),

            });
            let newArr = commentsData
            newArr.push({
                ...currentUserInfo, ...{
                    content: addingComment,
                    publishedAt: newDate
                }
            })
            setCommentsData(newArr)

            setAddingComment("")
        } else {
            alert('Please, login!')
        }
    }

    useEffect(() => {
        fetchAuthor()
        mapComments()
    }, [])

    return (
        <Card sx={{ p: 3, m: 3 }}>
            <CardHeader
                avatar={
                    <Avatar src={author.photoURL} aria-label="recipe" />
                }
                title={author.name}
                subheader={props.data.publishedAt}
            />
            {props.data.imageURL && props.data.imageURL !== ""
                ?
                <CardMedia
                    component="img"
                    image={props.data.imageURL}
                    alt="Post image"
                />
                : ""
            }

            <CardContent>
                <Typography variant="h4">{props.data.title}</Typography>
                <Typography sx={{ py: 2 }}>{props.data.description}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", pb: 2 }}>
                    <Button variant="contained" onClick={() => likePost()}>Like</Button>
                    <Typography variant="h6" sx={{ mx: 2 }}>{currentLikes} {currentLikes === 1 ? "person" : "people"} liked this</Typography>
                </Box>
                <Box>
                    <Typography variant="h4">Comments: </Typography>

                    {props.data.comments && props.data.comments !== 0 && commentsData && commentsData.length !== 0
                        ? commentsData.map((comment) => {
                            return (
                                <Card key={comment.id} variant="outlined" sx={{ display: "flex", alignItems: "center", my: 1, p: 2 }}>
                                    <Avatar alt={comment.name} src={comment.photoURL ? comment.photoURL : NoPersonImage} sx={{ width: 64, height: 64, mx: 1 }}></Avatar>
                                    <Box sx={{ mx: 2 }}>
                                        <Typography variant="h6" >{comment.name}</Typography>
                                        <Typography>{comment.publishedAt}</Typography>
                                    </Box>
                                    <Typography>{comment.content}</Typography>
                                </Card>
                            )
                        })
                        : <Typography>No comments on this post!</Typography>
                    }
                    {currentIsLogged
                        ? <Box sx={{ display: "flex", alignItems: "center" }}>
                            <TextField value={addingComment} onChange={(e) => setAddingComment(e.target.value)} id="outlined-basic" label="Comment" type="text" variant="outlined" sx={{ my: 1, mx: 1 }} />
                            <Button variant="contained" onClick={() => addComment()}>Add Comment</Button>
                        </Box>
                        : ""
                    }

                </Box>
            </CardContent>
        </Card >
    )
}

export default Post
