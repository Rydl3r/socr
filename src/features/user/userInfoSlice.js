import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {},
};

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = action.payload;
    },
    updatePhoto: (state, action) => {
      state.value.photo = action.payload;
    },
    updateName: (state, action) => {
      state.value.name = action.payload;
    },
    updateDescription: (state, action) => {
      state.value.description = action.payload;
    },
    addFriend: (state, action) => {
      state.value.friends.push(action.payload);
    },
    deleteFriend: (state, action) => {
      state.value.friends = state.value.friends.filter(
        (friend) => friend !== action.payload
      );
    },
    addSentRequest: (state, action) => {
      state.value.sentRequests.push(action.payload);
    },
    deleteSentRequest: (state, action) => {
      state.value.sentRequests = state.value.sentRequests.filter(
        (request) => request !== action.payload
      );
    },
    deleteRequest: (state, action) => {
      state.value.requests = state.value.requests.filter(
        (request) => request !== action.payload
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setUserInfo,
  updatePhoto,
  updateName,
  updateDescription,
  addFriend,
  deleteFriend,
  addSentRequest,
  deleteSentRequest,
  deleteRequest,
} = userInfoSlice.actions;

export default userInfoSlice.reducer;
