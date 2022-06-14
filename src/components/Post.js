import {
  Box,
  Card,
  CardMedia,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { addLike, removeLike } from "../features/posts/postsSlice";

import { app } from "../firebase";
import {
  doc,
  updateDoc,
  getFirestore,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import NoPersonImage from "../assets/no_person.svg";

import { fetchInfoAboutUser } from "./../utils/fetchInfoAboutUser";
import { useNavigate } from "react-router-dom";

const Post = (props) => {
  const [author, setAuthor] = useState({});
  const [commentsData, setCommentsData] = useState([]);
  const [addingComment, setAddingComment] = useState([]);
  const [currentLikes, setCurrentLikes] = useState(props.data.likes);
  const [commentsCount, setCommentsCount] = useState(3);

  const currentUserInfo = useSelector((state) => state.userInfo.value);
  const currentIsLogged = useSelector((state) => state.isLogged.value);

  const dispatch = useDispatch();
  const db = getFirestore(app);
  const navigate = useNavigate();

  const likePost = async () => {
    if (currentIsLogged === true) {
      if (currentLikes.includes(currentUserInfo.id)) {
        const currentRef = doc(db, "posts", props.data.id);
        await updateDoc(currentRef, {
          likes: arrayRemove(currentUserInfo.id),
        });
        dispatch(
          removeLike({ likeAuthor: currentUserInfo.id, postId: props.data.id })
        );
        let newArr = currentLikes.filter((like) => like !== currentUserInfo.id);
        setCurrentLikes(newArr);
      } else {
        const currentRef = doc(db, "posts", props.data.id);
        await updateDoc(currentRef, {
          likes: arrayUnion(currentUserInfo.id),
        });
        dispatch(
          addLike({ likeAuthor: currentUserInfo.id, postId: props.data.id })
        );
        setCurrentLikes([...currentLikes, currentUserInfo.id]);
      }
    } else {
      alert("Please, login!");
    }
  };

  const addComment = async () => {
    if (currentIsLogged === true) {
      let newDate = new Date().toLocaleString();
      const currentRef = doc(db, "posts", props.data.id);
      await updateDoc(currentRef, {
        comments: arrayUnion({
          author: currentUserInfo.id,
          content: addingComment,
          publishedAt: newDate,
        }),
      });
      let newArr = commentsData;
      newArr.push({
        ...currentUserInfo,
        ...{
          content: addingComment,
          publishedAt: newDate,
        },
      });
      setCommentsData(newArr);

      setAddingComment("");
    } else {
      alert("Please, login!");
    }
  };

  const deleteComment = async (commentToDelete) => {
    const currentRef = doc(db, "posts", props.data.id);
    let neededComment = {
      author: commentToDelete.id,
      content: commentToDelete.content,
      publishedAt: commentToDelete.publishedAt,
    };
    await updateDoc(currentRef, {
      comments: arrayRemove(neededComment),
    });

    let newArr = commentsData.filter(
      (comment) => JSON.stringify(comment) !== JSON.stringify(commentToDelete)
    );
    setCommentsData(newArr);
  };

  useEffect(() => {
    const fetchAuthor = async () => {
      const authorData = await fetchInfoAboutUser(props.data.author);
      setAuthor(authorData);
    };
    const mapComments = async () => {
      let newArr = [];
      for (let comment of props.data.comments) {
        let commentInfo = {};
        commentInfo = await fetchInfoAboutUser(comment.author);
        let merged = {
          ...{ content: comment.content, publishedAt: comment.publishedAt },
          ...commentInfo,
        };
        newArr.push(merged);
      }
      setCommentsData(newArr);
    };

    fetchAuthor();
    mapComments();
  }, [props.data.author, props.data.comments]);

  return (
    <Card sx={{ p: 3, m: 3 }}>
      <Box sx={{ display: "flex" }}>
        <CardHeader
          onClick={() => navigate("/profile/" + author.id)}
          sx={{ cursor: "pointer" }}
          avatar={<Avatar src={author.photoURL} aria-label="recipe" />}
          title={author.name}
          subheader={props.data.publishedAt}
        />
        {props.data.author === currentUserInfo.id ? (
          <Button
            variant="outlined"
            color="error"
            sx={{ display: "flex", ml: "auto", my: 2 }}
            onClick={() => props.deletePost(props.data.id)}
          >
            <CancelIcon sx={{ pr: 1 }}></CancelIcon>Delete Post
          </Button>
        ) : (
          ""
        )}
      </Box>
      {props.data.imageURL && props.data.imageURL !== "" ? (
        <CardMedia
          component="img"
          image={props.data.imageURL}
          alt="Post image"
        />
      ) : (
        ""
      )}

      <CardContent>
        <Typography variant="h4">{props.data.title}</Typography>
        <Typography sx={{ py: 2 }}>{props.data.description}</Typography>
        <Box sx={{ display: "flex", alignItems: "center", pb: 2 }}>
          <Button
            color="info"
            variant="outlined"
            sx={{ display: "flex" }}
            onClick={() => likePost()}
          >
            {currentLikes.includes(currentUserInfo.id) ? (
              <ThumbUpIcon></ThumbUpIcon>
            ) : (
              <ThumbUpOutlinedIcon></ThumbUpOutlinedIcon>
            )}{" "}
          </Button>
          <Typography variant="h6" sx={{ mx: 2 }}>
            {currentLikes.length}{" "}
            {currentLikes.length === 1 ? "person" : "people"} liked this
          </Typography>
        </Box>
        <Box>
          <Typography variant="h4">Comments: </Typography>

          {props.data.comments &&
          props.data.comments !== 0 &&
          commentsData &&
          commentsData.length !== 0 ? (
            commentsData.slice(0, commentsCount).map((comment) => {
              return (
                <Card
                  key={comment.id + comment.publishedAt}
                  variant="outlined"
                  sx={{ display: "flex", alignItems: "center", my: 1, p: 2 }}
                >
                  <Avatar
                    onClick={() => navigate("/profile/" + comment.id)}
                    alt={comment.name}
                    src={comment.photoURL ? comment.photoURL : NoPersonImage}
                    sx={{ width: 64, height: 64, mx: 1, cursor: "pointer" }}
                  ></Avatar>
                  <Box sx={{ mx: { sx: 0, md: 2 } }}>
                    <Typography variant="h6">{comment.name}</Typography>
                    <Typography>{comment.publishedAt}</Typography>
                  </Box>
                  <Typography>{comment.content}</Typography>
                  {comment.id === currentUserInfo.id ? (
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ display: "flex", ml: "auto", my: 2 }}
                      onClick={() => deleteComment(comment)}
                    >
                      <CancelIcon
                        sx={{ display: { xs: "none", md: "block" }, pr: 1 }}
                      ></CancelIcon>
                      Delete Comment
                    </Button>
                  ) : (
                    ""
                  )}
                </Card>
              );
            })
          ) : (
            <Typography>No comments on this post!</Typography>
          )}
          {commentsData.length > commentsCount ? (
            <Button
              variant="contained"
              onClick={() => setCommentsCount(commentsCount + 3)}
            >
              Load More Comments
            </Button>
          ) : (
            <Box>
              {commentsCount !== 3 ? (
                <Button
                  variant="contained"
                  sx={{ display: "flex" }}
                  onClick={() => setCommentsCount(3)}
                >
                  Load Less
                </Button>
              ) : (
                ""
              )}
            </Box>
          )}

          {currentIsLogged ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TextField
                multiline={true}
                value={addingComment}
                onChange={(e) => setAddingComment(e.target.value)}
                id="outlined-basic"
                label="Comment"
                type="text"
                variant="outlined"
                sx={{ my: 1, mx: 1 }}
              />
              <Button
                variant="contained"
                sx={{ display: "flex" }}
                onClick={() => addComment()}
              >
                <AddIcon sx={{ pr: 1 }}></AddIcon>Add Comment
              </Button>
            </Box>
          ) : (
            ""
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default Post;
