import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: "light",
}

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        changeTheme: (state) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            if (state.value === "light") {
                state.value = "dark"
            } else {
                state.value = "light"
            }
        }
    },
})

// Action creators are generated for each case reducer function
export const { changeTheme } = themeSlice.actions

export default themeSlice.reducer