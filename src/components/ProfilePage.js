import { Avatar, Box, Button, Container, Typography } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import SendIcon from "@mui/icons-material/Send";
import NoPersonImage from "../assets/no_person.svg";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import {
  deleteSentRequest,
  addSentRequest,
  deleteFriend,
} from "../features/user/userInfoSlice";

import {
  doc,
  updateDoc,
  getFirestore,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { app } from "../firebase";
import { fetchInfoAboutUser } from "./../utils/fetchInfoAboutUser";

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({});
  const [friends, setFriends] = useState([]);

  let { id } = useParams();
  let dispatch = useDispatch();

  const db = getFirestore(app);

  const currentUserInfo = useSelector((state) => state.userInfo.value);

  const sendRequest = async () => {
    if (currentUserInfo && currentUserInfo.id && currentUserInfo.id.length) {
      const sendToDocRef = doc(db, "users", id);
      await updateDoc(sendToDocRef, {
        requests: arrayUnion(currentUserInfo.id),
      });
      const sendFromDocRef = doc(db, "users", currentUserInfo.id);
      await updateDoc(sendFromDocRef, {
        sentRequests: arrayUnion(id),
      });
      dispatch(addSentRequest(id));
    } else {
      alert("Please, login!");
    }
  };

  const undoRequest = async () => {
    if (currentUserInfo && currentUserInfo.id && currentUserInfo.id.length) {
      const sendToDocRef = doc(db, "users", id);
      await updateDoc(sendToDocRef, {
        requests: arrayRemove(currentUserInfo.id),
      });
      const sendFromDocRef = doc(db, "users", currentUserInfo.id);
      await updateDoc(sendFromDocRef, {
        sentRequests: arrayRemove(id),
      });
      dispatch(deleteSentRequest(id));
    } else {
      alert("Please, login!");
    }
  };

  const unfriend = async () => {
    const unfriended = doc(db, "users", id);
    await updateDoc(unfriended, {
      friends: arrayRemove(currentUserInfo.id),
    });
    const currentUserRef = doc(db, "users", currentUserInfo.id);
    await updateDoc(currentUserRef, {
      friends: arrayRemove(id),
    });
    dispatch(deleteFriend(id));
    let newArr = friends.filter((friend) => friend.id !== currentUserInfo.id);
    setFriends(newArr);
  };

  useEffect(() => {
    const getFriends = async () => {
      const user = await fetchInfoAboutUser(id);
      setUserInfo(user);
      let newArr = [];
      if (user && user.friends && user.friends.length !== 0) {
        for (let friendId of user.friends) {
          const friend = await fetchInfoAboutUser(friendId);
          newArr.push(friend);
        }
        setFriends(newArr);
      }
    };
    getFriends();
  }, [id]);

  return (
    <div>
      {userInfo && Object.keys(userInfo).length !== 0 ? (
        <Container sx={{ textAlign: "center", py: 2 }}>
          <Avatar
            alt={userInfo.name}
            src={userInfo.photoURL ? userInfo.photoURL : NoPersonImage}
            sx={{ width: 128, height: 128, mx: "auto" }}
          />
          <Typography variant="h4" sx={{ py: 2 }}>
            {userInfo.name}
          </Typography>
          <Typography variant="h5" sx={{ py: 2 }}>
            {userInfo.description}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {friends && friends.length > 0
              ? friends.map((friend) => {
                  return (
                    <Box key={friend.id}>
                      <Link
                        to={
                          friend.id !== currentUserInfo.id
                            ? "/profile/" + friend.id
                            : "/myprofile"
                        }
                      >
                        <Avatar
                          alt={friend.name}
                          src={
                            friend.photoURL ? friend.photoURL : NoPersonImage
                          }
                          sx={{ width: 64, height: 64, mx: 1 }}
                        ></Avatar>
                      </Link>
                    </Box>
                  );
                })
              : ""}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="h6" sx={{ p: 2 }}>
              This user has {friends.length}{" "}
              {friends.length !== 1 ? "friends" : "friend"}
            </Typography>
            {currentUserInfo &&
            currentUserInfo.friends &&
            currentUserInfo.friends.includes(id) ? (
              <Button
                color="info"
                onClick={() => unfriend()}
                variant="outlined"
                sx={{ m: 2, display: "flex" }}
              >
                <CancelIcon sx={{ pr: 1 }}></CancelIcon>Unfriend
              </Button>
            ) : (
              <Box>
                {currentUserInfo &&
                currentUserInfo.sentRequests &&
                currentUserInfo.sentRequests.includes(id) ? (
                  <Button
                    color="error"
                    onClick={() => undoRequest()}
                    variant="contained"
                    sx={{ m: 2, display: "flex" }}
                  >
                    <CancelIcon sx={{ pr: 1 }}></CancelIcon>Undo request
                  </Button>
                ) : (
                  <Button
                    color="success"
                    onClick={() => sendRequest()}
                    variant="contained"
                    sx={{ m: 2, display: "flex" }}
                  >
                    <SendIcon sx={{ pr: 1 }}></SendIcon>Send Request
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Container>
      ) : (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" sx={{ p: 2 }}>
            No User has been found by this id.
            <br /> Are you sure you're on the right page?
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default ProfilePage;
