import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
  userId: Number,
  userName: String,
  password: String
})

const User = mongoose.model('User', userSchema)

export default User
