const userService = require('../../services/userService')
const jwt = require('jsonwebtoken')

const userController = {
  login: (req, res, next) => {
    console.log(req.user)
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.json({
        status: 'success',
        message: '登入成功',
        result: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController