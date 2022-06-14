import { Avatar, Box, Button, Typography, Card } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import NoPersonImage from "../assets/no_person.svg";

import { useSelector, useDispatch } from "react-redux";
import { deleteRequest, addFriend } from "../features/user/userInfoSlice";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  doc,
  updateDoc,
  getFirestore,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { app } from "../firebase";

import { fetchInfoAboutUser } from "./../utils/fetchInfoAboutUser";

const MyRequestsPage = () => {
  const [requestsUsers, setRequestsUsers] = useState([]);

  const requests = useSelector((state) => state.userInfo.value.requests);
  const currentUser = useSelector((state) => state.userInfo.value);

  let dispatch = useDispatch();

  const db = getFirestore(app);

  const acceptFriend = async (acceptedId) => {
    const currentRef = doc(db, "users", currentUser.id);
    await updateDoc(currentRef, {
      friends: arrayUnion(acceptedId),
      requests: arrayRemove(acceptedId),
    });
    const newFriendRef = doc(db, "users", acceptedId);
    await updateDoc(newFriendRef, {
      friends: arrayUnion(currentUser.id),
      sentRequests: arrayRemove(currentUser.id),
    });
    dispatch(deleteRequest(acceptedId));
    dispatch(addFriend(acceptedId));
    let newArr = requestsUsers.filter(
      (requestsUser) => requestsUser.id !== acceptedId
    );
    setRequestsUsers(newArr);
  };

  const rejectFriend = async (acceptedId) => {
    const currentRef = doc(db, "users", currentUser.id);
    await updateDoc(currentRef, {
      requests: arrayRemove(acceptedId),
    });
    const newFriendRef = doc(db, "users", acceptedId);
    await updateDoc(newFriendRef, {
      sentRequests: arrayRemove(currentUser.id),
    });
    dispatch(deleteRequest(acceptedId));
    let newArr = requestsUsers.filter(
      (requestsUser) => requestsUser.id !== acceptedId
    );
    setRequestsUsers(newArr);
  };

  useEffect(() => {
    const fetchRequestsUsers = async () => {
      let newArr = [];
      setRequestsUsers([]);
      if (requests && requests.length !== 0) {
        for (let request of requests) {
          const user = await fetchInfoAboutUser(request);
          newArr.push(user);
        }
        setRequestsUsers(newArr);
      }
    };
    fetchRequestsUsers();
  }, [requests]);

  return (
    <Box sx={{ textAlign: "center", p: 2 }}>
      {requests &&
      requestsUsers &&
      requests.length > 0 &&
      requestsUsers.length > 0 ? (
        <Box>
          <Typography variant="h4" sx={{ p: 2 }}>
            Your friends requests
          </Typography>
          <Box>
            {requestsUsers.map((user) => (
              <Card key={user.id} variant="outlined" sx={{ p: 2 }}>
                <Link to={"/profile/" + user.id} sx={{ mx: 2 }}>
                  <Avatar
                    alt={user.name}
                    src={user.photoURL ? user.photoURL : NoPersonImage}
                    sx={{ width: 64, height: 64, mx: "auto" }}
                  ></Avatar>
                  <Typography>{user.name}</Typography>
                </Link>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    color="success"
                    sx={{ mx: 2, display: "flex" }}
                    variant="contained"
                    onClick={() => acceptFriend(user.id)}
                  >
                    <CheckIcon sx={{ pr: 1 }}></CheckIcon>
                  </Button>
                  <Button
                    color="error"
                    sx={{ mx: 2, display: "flex" }}
                    variant="contained"
                    onClick={() => rejectFriend(user.id)}
                  >
                    <CancelIcon sx={{ pr: 1 }}></CancelIcon>
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      ) : (
        <Typography variant="h4" sx={{ p: 2 }}>
          No requests found! Try adding new friends yourself!
        </Typography>
      )}
    </Box>
  );
};

export default MyRequestsPage;
