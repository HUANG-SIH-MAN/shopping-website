module.exports = {
  apiErrorHandler (err, req, res, next) { 
    if (err instanceof Error) { 
      res.status(200).json({
        status: 'error',
        statusCode: 400,
        message: `${err.name}: ${err.message}`
      })
    } else {
      res.status(200).json({
        status: 'error',
        statusCode: 400,
        message: `${err}`
      }) 
    } 
    next(err) 
  } 
}
