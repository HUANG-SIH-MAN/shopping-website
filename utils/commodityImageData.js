if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const axios = require('axios')
const unsplashAPIClientId = process.env.unsplashAPIClientId
const searchItem = 'product'
const url = `https://api.unsplash.com/search/photos/?client_id=${unsplashAPIClientId}&per_page=30&query=${searchItem}`
module.exports = axios.get(url)
  .then(function (response) {
    const data = response['data']['results']
    .map(i => i['urls']['small'])
    return data
  })
  .catch(function (error) {
    console.log("can not get unsplash API", error);
})
