import { useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { setPosts, addPost } from '../features/posts/postsSlice'

import { doc, updateDoc, getDocs, getFirestore, arrayUnion, arrayRemove, query, collection } from "firebase/firestore";
import { app } from '../firebase'
import { Box, Typography, Card } from '@mui/material';
import { fetchInfoAboutUser } from './../utils/fetchInfoAboutUser';
import Post from './Post';



const HeroPage = () => {
    const [posts, setPosts] = useState([])

    const currentPosts = useSelector((state) => state.posts.value)

    const db = getFirestore(app)
    const dispatch = useDispatch()

    const fetchPosts = async () => {
        let newArr = []
        const q = query(collection(db, "posts"))
        const collectionSnap = await getDocs(q);
        collectionSnap.forEach((post) => {
            const data = post.data()
            data.id = post.id
            newArr.push(data)
            dispatch(addPost(data))
        });
        setPosts(newArr)
    }

    useEffect(() => {
        fetchPosts()
    }, [])
    return (
        <Box>
            {posts && posts.length > 0
                ?
                <Box>
                    <Typography variant="h4" sx={{ p: 2, textAlign: "center" }}>Check out the latest posts!</Typography>
                    <Box>
                        {posts.map((post) => {
                            return (
                                <Post key={post.id} data={post} />
                            )
                        })}
                    </Box>
                </Box>
                :
                <Typography variant="h2" sx={{ p: 2 }}>No posts found for now! Try adding a new post yourself!</Typography>}
        </Box>
    )
}

export default HeroPage
