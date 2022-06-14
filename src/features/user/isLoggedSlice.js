import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
};

export const isLoggedSlice = createSlice({
  name: "isLogged",
  initialState,
  reducers: {
    setLoggedIn: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = true;
    },
    setLoggedOut: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLoggedIn, setLoggedOut } = isLoggedSlice.actions;

export default isLoggedSlice.reducer;
