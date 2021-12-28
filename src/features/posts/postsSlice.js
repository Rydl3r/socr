import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: [],
}

export const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPosts: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.value = action.payload
        },
        addPost: (state, action) => {
            console.log("adding")
            state.value.push(action.payload)
        },
        addLike: (state, action) => {
            let neededIndex = state.value.findIndex((post) => post.id === action.payload.postId)
            state.value[neededIndex].likes.push(action.payload.likeAuthor)
        },
        addComment: (state, action) => {
            let neededIndex = state.value.findIndex((post) => post.id === action.payload.postId)
            let newPost = { author: action.payload.author, content: action.payload.content, publishedAt: action.payload.publishedAt }
            state.value[neededIndex].comments.push(newPost)
        }
    },
})

// Action creators are generated for each case reducer function
export const { setPosts, addPost, addLike, addComment } = postsSlice.actions

export default postsSlice.reducer