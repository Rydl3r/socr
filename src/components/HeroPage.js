import { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { addPost } from "../features/posts/postsSlice";
import { Link } from "react-router-dom";

import {
  doc,
  deleteDoc,
  getDocs,
  getFirestore,
  query,
  collection,
} from "firebase/firestore";
import { app } from "../firebase";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Post from "./Post";

const HeroPage = () => {
  const [posts, setPosts] = useState([]);
  const [maxPosts, setMaxPosts] = useState(3);

  const isLogged = useSelector((state) => state.isLogged.value);

  const db = getFirestore(app);
  const dispatch = useDispatch();

  const deletePost = async (postId) => {
    await deleteDoc(doc(db, "posts", postId));

    let newArr = posts.filter((post) => post.id !== postId);
    setPosts(newArr);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      let newArr = [];
      const q = query(collection(db, "posts"));
      const collectionSnap = await getDocs(q);
      collectionSnap.forEach((post) => {
        const data = post.data();
        data.id = post.id;
        newArr.push(data);
        dispatch(addPost(data));
      });
      setPosts(newArr);
    };
    fetchPosts();
  }, [db, dispatch]);
  return (
    <Box>
      {posts && posts.length > 0 ? (
        <Typography variant="h4" sx={{ p: 2, textAlign: "center" }}>
          Check out the latest posts!
        </Typography>
      ) : (
        ""
      )}
      {isLogged ? (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
          <Link to="/addpost">
            <Button sx={{ display: "flex" }} variant="contained">
              <AddIcon sx={{ pr: 1 }}></AddIcon>Add Post
            </Button>
          </Link>
        </Box>
      ) : (
        ""
      )}
      {posts && posts.length > 0 ? (
        <Box>
          <Box>
            {posts.slice(0, maxPosts).map((post) => {
              return <Post key={post.id} data={post} deletePost={deletePost} />;
            })}
            {posts.length > maxPosts ? (
              <Button
                variant="contained"
                onClick={() => setMaxPosts(maxPosts + 3)}
              >
                Load More Posts
              </Button>
            ) : (
              <Box>
                {maxPosts !== 3 ? (
                  <Button
                    variant="contained"
                    sx={{ display: "flex" }}
                    onClick={() => setMaxPosts(3)}
                  >
                    Load Less
                  </Button>
                ) : (
                  ""
                )}
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default HeroPage;
