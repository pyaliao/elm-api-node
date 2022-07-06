import mongoose from 'mongoose'

const Schema = mongoose.Schema

const shopSchema = new Schema({
  activities: [{
    description: String,
    iconColor: String,
    iconName: String,
    id: Number,
    name: String
  }],
  address: String,
  deliveryMode: {
    color: String,
    id: Number,
    isSolid: Boolean,
    text: String
  },
  description: { type: String, default: '' },
  orderLeadTime: { type: String, default: '' },
  distance: { type: String, default: '' },
  location: { type: [Number], index: '2d' },
  floatDeliveryFee: { type: Number, default: 0 },
  floatMinimumOrderAmount: { type: Number, default: 0 },
  id: Number,
  category: String,
  identification: {
    companyName: { type: String, default: '' },
    identificateAgency: { type: String, default: '' },
    identificateDate: { type: Date, default: Date.now },
    legalPerson: { type: String, default: '' },
    licensesDate: { type: String, default: '' },
    licensesNumber: { type: String, default: '' },
    licensesScope: { type: String, default: '' },
    operationPeriod: { type: String, default: '' },
    registeredAddress: { type: String, default: '' },
    registeredNumber: { type: String, default: '' },
  },
  imagePath: { type: String, default: '' },
  isPremium: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  latitude: Number,
  longitude: Number,
  license: {
    businessLicenseImage: { type: String, default: '' },
    cateringServiceLicenseImage: { type: String, default: '' }
  },
  name: {
    type: String,
    required: true
  },
  openingHours: { type: Array, default: ['08:30/20:30'] },
  phone: {
    type: String,
    required: true
  },
  piecewiseAgentFee: {
    tips: String
  },
  promotionInfo: { type: String, default: '欢迎光临，用餐高峰请提前下单，谢谢' },
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  recentOrderNum: { type: Number, default: 0 },
  status: { type: Number, default: 0 },
  supports: [{
    description: String,
    iconColor: String,
    iconName: String,
    id: Number,
    name: String
  }]
})
shopSchema.index({ id: 1 })

const Shop = mongoose.model('Shop', shopSchema)

export default Shop
