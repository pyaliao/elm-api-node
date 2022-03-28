import mongoose from 'mongoose'

const Schema = mongoose.Schema

const addressSchema = new Schema({
  id: Number,
  userId: Number,
  address: String,
  phone: String,
  isValid: { type: Number, default: 1 },
  createAt: { type: Date, default: Date.now() },
  PhoneBack: String,
  tagType: Number,
  name: String,
  geoHash: String,
  addressDetail: String,
  poiType: { type: Number, default: 0 },
  gender: { type: Number, default: 1 },
  cityId: { type: Number, default: 1 },
  tag: { type: String, default: '家' },
  isUserDefault: { type: Boolean, default: true },
  isDeliverable: { type: Boolean, default: true },
  agentFee: { type: Number, default: 0 },
  deliverCount: { type: Number, default: 0 },
  phoneHadBound: { type: Boolean, default: true }
})

addressSchema.index({ id: 1 })

const Address = mongoose.model('Address', addressSchema)

export default Address
