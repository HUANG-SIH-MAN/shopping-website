const { User } = require('../models')
const bcrypt = require('bcryptjs')

const userService = {
  register: (name, email, password) => {
    return new Promise((resolve, reject) => {
      User.findOrCreate({
        where: { email },
        defaults: { 
          name,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
          isAdmin: false
        }
      })
      .then(user => {
        if (!user[1]) throw new Error('該信箱已經被註冊過了!!')
        return resolve('註冊成功')
      })
      .catch(err => reject(err))
    })
  }
}

module.exports = userService
