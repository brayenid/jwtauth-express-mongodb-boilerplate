import db from '../database/db.js'

const AuthModel = db.model('token', {
  userId: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  createdAt: {
    type: String
  }
})

export default AuthModel
