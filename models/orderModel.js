import mongoose from 'mongoose'

const Schema = mongoose.Schema

const orderSchema = new Schema({
  basket: {
    abandonedExtra: [
      {
        categoryId: Number,
        name: { type: String, default: '' },
        price: { type: Number, default: 0 },
        quantity: { type: Number, default: 0 }
      }
    ],
    deliverFee: {
      categoryId: { type: Number, default: 2 },
      name: { type: String, default: '配送费' },
      price: { type: Number, default: 4 },
      quantity: { type: Number, default: 1 }
    },
    extra: [],
    group: [
      [
        {
          attrs: [],
          newSpecs: [],
          name: String,
          price: Number,
          quantity: Number,
          specs: [String]
        }
      ]
    ],
    packingFee: {
      categoryId: { type: Number, default: 1 },
      name: { type: String, default: '餐盒' },
      price: Number,
      quantity: Number
    },
    pindanMap: []
  },
  formattedCreatedAt: String,
  orderTime: Number,
  timePass: Number,
  id: Number,
  isBrand: { type: Number, default: 0 },
  isDeletable: { type: Number, default: 1 },
  isNewPay: { type: Number, default: 1 },
  isPindan: { type: Number, default: 0 },
  operationConfirm: { type: Number, default: 0 },
  operationPay: { type: Number, default: 0 },
  operationRate: { type: Number, default: 0 },
  operationRebuy: { type: Number, default: 2 },
  operationUploadPhoto: { type: Number, default: 0 },
  payRemainSeconds: { type: Number, default: 0 },
  ratedPoint: { type: Number, default: 0 },
  remindReplyCount: { type: Number, default: 0 },
  restaurantId: Number,
  restaurantImageHash: String,
  restaurantImageUrl: String,
  restaurantName: String,
  restaurantType: { type: Number, default: 0 },
  statusBar: {
    color: String,
    imageType: String,
    subTitle: String,
    title: String
  },
  statusCode: { type: Number, default: 0 },
  timelineNode: {
    actions: [],
    description: String,
    inProcessing: { type: Number, default: 0 },
    subDescription: String,
    title: String
  },
  topShow: { type: Number, default: 0 },
  totalAmount: Number,
  totalQuantity: Number,
  uniqueId: Number,
  userId: Number,
  addressId: Number
})

orderSchema.index({ id: 1 })

const Order = mongoose.model('Order', orderSchema)

export default Order
