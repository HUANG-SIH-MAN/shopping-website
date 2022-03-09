module.exports = {
  apiErrorHandler (err, req, res, next) { 
    console.log(err)
    if (err instanceof Error) { 
      res.status(200).json({
        status: 'error',
        code: 400,
        message: `${err.name}: ${err.message}`
      })
    } else {
      res.status(200).json({
        status: 'error',
        code: 400,
        message: `${err}`
      }) 
    } 
    next(err) 
  } 
}
