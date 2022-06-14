import { Box, Typography, TextField, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { useState } from "react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { addDoc, getFirestore, collection } from "firebase/firestore";
import { app } from "../firebase";

const AddPostPage = () => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const currentUser = useSelector((state) => state.userInfo.value);
  const isLogged = useSelector((state) => state.isLogged.value);

  const navigate = useNavigate();
  const db = getFirestore(app);

  const addPost = async () => {
    if (isLogged) {
      if (title !== "" && content !== "") {
        let newPost = {
          author: currentUser.id,
          imageURL: image ? image : null,
          title: title,
          description: content,
          comments: [],
          likes: [],
          publishedAt: new Date().toLocaleString(),
        };

        await addDoc(collection(db, "posts"), newPost);
        navigate("/");
      } else {
        alert("Please, input all data");
      }
    } else {
      alert("Please, login!");
    }
  };

  return (
    <Box sx={{ textAlign: "center", p: 2 }}>
      <Typography sx={{ pb: 2 }} variant="h2">
        Add a new post
      </Typography>
      <Box sx={{ mx: "25%" }}>
        <TextField
          fullWidth
          sx={{ my: 1 }}
          value={image}
          onChange={(e) => setImage(e.target.value)}
          label="Post image url"
          type="text"
          variant="outlined"
        ></TextField>
        <TextField
          required
          fullWidth
          sx={{ my: 1 }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="Post title"
          type="text"
          variant="outlined"
        ></TextField>
        <TextField
          required
          fullWidth
          multiline={true}
          size="large"
          sx={{ my: 1 }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          label="Post description"
          type="text"
          variant="outlined"
        ></TextField>
      </Box>
      <Button
        sx={{ display: "flex", mx: "auto" }}
        variant="contained"
        onClick={() => addPost()}
      >
        <AddIcon sx={{ pr: 1 }} /> Add Post
      </Button>
    </Box>
  );
};

export default AddPostPage;
