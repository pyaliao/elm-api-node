import mongoose  from 'mongoose'

const Schema = mongoose.Schema

const foodSchema = new Schema({
  rating: { type: Number, default: 0 },
  isFeatured: { type: Number, default: 0 },
  restaurantId: { type: Number, isRequired: true },
  categoryId: { type: Number, isRequired: true },
  pinyinName: { type: String, default: '' },
  displayTimes: { type: Array, default: [] },
  attrs: { type: Array, default: [] },
  description: { type: String, default: "" },
  monthSales: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  tips: String,
  imagePath: String,
  specifications: [Schema.Types.Mixed],
  serverUtc: { type: Date, default: Date.now() },
  isEssential: { type: Boolean, default: false },
  attributes: { type: Array, default: [] },
  itemId: { type: Number, isRequired: true },
  limitation: Schema.Types.Mixed,
  name: { type: String, isRequired: true },
  satisfyCount: { type: Number, default: 0 },
  activity: Schema.Types.Mixed,
  satisfyRate: { type: Number, default: 0 },
  specfoods: [{
    originalPrice: { type: Number, default: 0 },
    skuId: { type: Number, isRequired: true },
    name: { type: String, isRequired: true },
    pinyinName: { type: String, default: '' },
    restaurantId: { type: Number, isRequired: true },
    foodId: { type: Number, isRequired: true },
    packingFee: { type: Number, default: 0 },
    recentRating: { type: Number, default: 0 },
    promotionStock: { type: Number, default: -1 },
    price: { type: Number, default: 0 },
    soldOut: { type: Boolean, default: false },
    recentPopularity: { type: Number, default: 0 },
    isEssential: { type: Boolean, default: false },
    itemId: { type: Number, isRequired: true },
    checkoutMode: { type: Number, default: 1 },
    stock: { type: Number, default: 1000 },
    specsName: String,
    specs: [
      {
        name: String,
        value: String
      }
    ]
  }]
})

foodSchema.index({ itemId: 1 })

const menuSchema = new Schema({
  description: String,
  isSelected: { type: Boolean, default: true },
  iconUrl: { type: String, default: '' },
  name: { type: String, isRequired: true },
  id: { type: Number, isRequired: true },
  restaurantId: { type: Number, isRequired: true },
  type: { type: Number, default: 1 },
  foods: [foodSchema]
})

menuSchema.index({ id: 1 })

const Food = mongoose.model('Food', foodSchema)

const Menu = mongoose.model('Menu', menuSchema)

export { Food, Menu }
