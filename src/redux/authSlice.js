import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  accessToken: localStorage.getItem("accessToken"),
  currentUser: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.accessToken = action.payload.accessToken
      state.currentUser = action.payload.user || null
    },

    setCurrentUser(state, action) {
      state.currentUser = action.payload
    },

    logout(state) {
      state.accessToken = null
      state.currentUser = null
      localStorage.removeItem("accessToken")
    },
  },
})

export const { setCredentials, setCurrentUser, logout } = authSlice.actions

export default authSlice.reducer
