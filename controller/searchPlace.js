'use strict'

import chalk from 'chalk'
import LocationComponent from '../common/locationComponent'
import CityModel from '../models/cityModel'
import CityHandler from './city'

class SearchPlace extends LocationComponent {
  constructor () {
    super()
    this.search = this.search.bind(this)
  }

  async search (req, res, next) {
    let { type = 'search', cityId, keyword } = req.query
    if (!keyword) {
      res.send({
        status: 0,
        type: 'ERROR_QUERY_KEYWORD',
        message: 'keyword参数错误'
      })
    } else if (isNaN(cityId)) {
      // 如果cityID没有传递过来，则手动获取cityID
      try {
        const cityName = await CityHandler.getCityName(req)
        const cityInfo = await CityModel.cityGuess(cityName)
        cityId = cityInfo.id
      } catch (error) {
        console.log(chalk.red('获取cityId失败', error))
        res.send({
          status: 0,
          type: 'ERROR_GET_CITYID',
          message: '获取cityId失败'
        })
      }
    }
    try {
      // console.log(chalk.yellow(req.query.keyword, req.query.cityId, req.query.type))
      const cityInfo = await CityModel.getCityById(cityId)
      console.log(chalk.yellow(cityInfo))
      const resLocation = await this.searchLocation(keyword, cityInfo.name, type)
      const locationList = []
      resLocation.data.forEach((item) => {
        locationList.push({
          name: item.title,
          address: item.address,
          lat: item.location.lat,
          lng: item.location.lng,
          geoHash: item.location.lat + ',' + item.location.lng
        })
      })
      res.send(locationList)
    } catch (error) {
      console.log(chalk.red(error))
      res.send({
        status: 0,
        type: 'ERROR_SEARCH_ADDRESS',
        message: '搜索地址信息失败'
      })
    }
  }
}

export default new SearchPlace()
