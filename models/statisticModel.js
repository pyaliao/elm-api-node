import mongoose from 'mongoose'

const Schema = mongoose.Schema

const statisticSchema = new Schema({
  date: String,
  origin: String,
  id: Number
})

statisticSchema.index({ id: 1 })

const Statistic = mongoose.model('Statistic', statisticSchema)

export default Statistic
