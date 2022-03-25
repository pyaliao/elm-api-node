import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userInfoSchema = new Schema({
  avatar: { type: String, default: 'default.jpg' },
  balance: { type: String, default: 0 },
  brandMemberNew: { type: Number, default: 0 },
  currentAddressId: { type: Number, default: 0 },
  currentInvoiceId: { type: Number, default: 0 },
  deliveryCardExpireDays: { type: Number, default: 0 },
  email: { type: String, default: '' },
  giftCount: { type: Number, default: 0 },
  city: String,
  registerTime: String,
  id: Number,
  userId: Number,
  userName: String,
  isActive: { type: String, default: false },
  isEmailValid: { type: Boolean, default: false },
  isMobileValid: { type: Boolean, default: false },
  mobile: { type: String, default: '' },
  point: { type: Number, default: 0 },
  columnDesc: {
    gameDesc: { type: String, default: '玩游戏领红包' },
    gameImageHash: { type: String, default: '05f108ca4e0c543488799f0c7c708cb1jpeg' },
    gameIsShow: { type: Boolean, default: false },
    gameLink: { type: String, default: 'https://gamecenter.faas.ele.me' },
    giftMallDesc: { type: String, default: '0元好物在这里' }
  }
})

userInfoSchema.index({ id: 1 })

const UserInfo = mongoose.model('UserInfo', userInfoSchema)

export default UserInfo
