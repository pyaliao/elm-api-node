import mongoose from 'mongoose'

const Schema = mongoose.Schema

const cartItemSchema = new Schema({
  attrs: [],
  extra: [],
  id: Number,
  newSpecs: [],
  name: String,
  price: Number,
  quantity: Number,
  specs: [String],
  packingFee: Number,
  skuId: Number,
  stock: Number
})
const extraItemSchema = new Schema({
  description: String,
  name: { type: String, default: '餐盒' },
  price: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 },
  type: { type: Number, default: 0 }
})
const paymentItem = new Schema({
  description: String,
  disabled_reason: String,
  id: Number,
  isOnlinePayment: { type: Boolean, default: true },
  name: String,
  promotion: [],
  selectState: Number
})
const cartSchema = new Schema({
  id: Number,
  cart: {
    id: Number,
    groups: [[cartItemSchema]],
    extra: [extraItemSchema],
    deliverCount: Number,
    deliverTime: String,
    discountCount: Number,
    distInfo: String,
    idAddressTooFar: { type: Boolean, default: false },
    isDeliverByFengniao: Boolean,
    isOnlinePaid: { type: Number, default: 1 },
    isOntimeAvailable: { type: Number, default: 0 },
    mustNewUser: { type: Number, default: 0 },
    mustPayOnline: { type: Number, default: 0 },
    ontimeStatus: { type: Number, default: 0 },
    ontimeUnavailableReason: String,
    originalTotal: Number,
    phone: String,
    promiseDeliveryTime: { type: Number, default: 0 },
    restaurantId: Number,
    restaurantInfo: String,
    restaurantMinimumOrderCount: Number,
    restaurantNameForUrl: String,
    restaurantStatus: { type: Number, default: 1 },
    serviceFeeExplanation: { type: Number, default: 0 },
    total: Number,
    userId: Number
  },
  deliveryReachTine: String,
  invoice: {
    isAvailable: { type: Boolean, default: false },
    satusText: String
  },
  sig: String,
  currentAddress: {},
  payments: [paymentItem],
  deliverTimes: [],
  deliverTimeV2: [],
  merchantCouponInfo: {},
  numberOfMeals: {},
  discountRule: {},
  hongbaoInfo: {},
  isSupportCoupon: { type: Boolean, default: false },
  isSupportNinja: { type: Number, default: 1 }
})

cartSchema.index({ id: 1 })

const Cart = mongoose.model('Cart', cartSchema)

export default Cart
