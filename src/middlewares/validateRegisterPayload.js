import UsersModel from '../models/UsersModel.js'

const validateRegisterPayload = async (req, res, next) => {
  const isUserExisted = await UsersModel.findOne({
    username: req.body.username
  })
  if (isUserExisted) {
    return res.status(400).json({
      status: 'fail',
      message: 'User with this username is already taken'
    })
  }
  next()
}

export default validateRegisterPayload
