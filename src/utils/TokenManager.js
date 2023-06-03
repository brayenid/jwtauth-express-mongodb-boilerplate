import jwt from 'jsonwebtoken'
import jwtDecode from 'jwt-decode'
import AuthModel from '../models/AuthModels.js'

const TokenManager = {
  generateAccessToken: (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: '20s'
    })
  },
  generateRefreshToken: (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
      expiresIn: '4d'
    })
  },
  verifyRefreshToken: (refreshToken) => {
    try {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY)
      const artifacts = jwtDecode(refreshToken)
      const payload = artifacts
      return payload
    } catch (error) {
      throw new Error('Refresh token is invalid')
    }
  },
  clearOldRefreshToken: async (userId, token) => {
    try {
      const tokens = (await AuthModel.find({ userId })).filter((tkn) => tkn.refreshToken !== token)

      if (tokens.length < 1) {
        return
      }
      const tokensToDelete = tokens.map((token) => token.refreshToken)
      await AuthModel.deleteMany({ refreshToken: { $in: tokensToDelete } })
    } catch (err) {
      console.error(err)
    }
  }
}

export default TokenManager
