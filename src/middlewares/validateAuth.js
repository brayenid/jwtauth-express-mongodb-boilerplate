import jwtDecode from 'jwt-decode'
import jwt from 'jsonwebtoken'
import UsersModel from '../models/UsersModel.js'

const validateAuth = async (req, res, next) => {
  const { authorization } = req.headers

  // CEK APAKAH TOKEN ADA DALAM HEADERS
  if (!authorization) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are unauthenticated!'
    })
  }

  const token = authorization.split(' ')[1]

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_KEY)
    const { id } = jwtDecode(token)

    // CEK APAKAH USER DENGAN ID INI TERSEDIA DI DB
    const isUserIdValid = await UsersModel.findOne({
      id
    })

    if (!isUserIdValid) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not registered yet!'
      })
    }

    // MEMASANG INFORMASI USER PADA ATRIBUT REQUEST
    req.user = decodedToken

    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Your token is expired'
      })
    }

    return res.status(401).json({
      status: 'fail',
      message: 'Invalid Token'
    })
  }
}

export default validateAuth
