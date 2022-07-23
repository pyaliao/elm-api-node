import mongoose from 'mongoose'

const Schema = mongoose.Schema

const adminSchema = new Schema({
  userName: String,
  password: String,
  id: Number,
  createTime: String,
  admin: { type: String, default: '管理员' },
  status: Number, // 1:普通管理员  2:超级管理员
  avatar: { type: String, default: 'default.jpg' },
  city: String
})

adminSchema.index({ id: 1 })

const Admin = mongoose.model('Admin', adminSchema)

export default Admin
