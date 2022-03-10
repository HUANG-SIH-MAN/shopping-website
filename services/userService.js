const { User } = require('../models')

const userService = {
  login: (req) => {
    return new Promise((resolve, reject) => {
      const { email, password } = req.body
    })
  }
}

module.exports = userService