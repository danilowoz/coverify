import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserSchema {
  userName?: string | null
  profilePic?: string | null
  id: string
  token: string
}

type InitialAuthState = UserSchema | null

const { reducer: authReducer, actions: authActions } = createSlice({
  initialState: null as InitialAuthState,
  name: 'user',
  reducers: {
    reset: () => null,
    set: (_, action: PayloadAction<UserSchema>) => action.payload,
  },
})

export { authActions, authReducer }
