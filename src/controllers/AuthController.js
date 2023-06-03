import UsersModel from '../models/UsersModel.js'
import AuthModel from '../models/AuthModels.js'
import bcrypt from 'bcrypt'
import TokenManager from '../utils/TokenManager.js'

const AuthController = {
  async getToken(req, res) {
    const { username, password } = req.body
    const credential = await UsersModel.findOne({
      username
    })

    if (!credential) {
      return res.status(404).json({
        status: 'fail',
        message: 'User is not exist'
      })
    }

    const isCredentialValid = await bcrypt.compare(password, credential.password)
    if (!isCredentialValid) {
      return res.status(401).json({
        status: 'fail',
        message: 'Credential invalid!'
      })
    }

    const { id, role, username: userName, name } = credential

    const accessToken = TokenManager.generateAccessToken({ id, role, username: userName, name })
    const refreshToken = TokenManager.generateRefreshToken({ id, role, username: userName, name })

    const authStore = new AuthModel({
      userId: id,
      refreshToken,
      createdAt: new Date()
    })
    await authStore.save()

    // REMOVE OLD REFRESH TOKEN ANTICIPATE TOO MANY TOKENS FOR 1 USER || LOGIN CAN ONLY BE DONE ON 1 DEVICE
    await TokenManager.clearOldRefreshToken(id, refreshToken)

    res
      .status(200)
      .cookie('refreshToken', refreshToken, {
        domain: 'localhost',
        httpOnly: true
      })
      .json({
        status: 'success',
        message: 'Login Successfully',
        data: {
          accessToken
        }
      })
  },
  async putToken(req, res) {
    const { refreshToken } = req.cookies
    try {
      const isRefreshTokenAvailable = await AuthModel.findOne({
        refreshToken
      })

      if (!isRefreshTokenAvailable) {
        throw new Error('Refresh Token is not available')
      }

      const { id, role, username, name } = TokenManager.verifyRefreshToken(refreshToken)

      const accessToken = TokenManager.generateAccessToken({ id, role, username, name })

      return res.status(200).json({
        status: 'success',
        data: {
          accessToken
        }
      })
    } catch (error) {
      await AuthModel.findOneAndDelete({
        refreshToken
      })

      return res.status(403).clearCookie('refreshToken').json({
        status: 'fail',
        message: error.message
      })
    }
  },
  async removeToken(req, res) {
    try {
      const { refreshToken } = req.cookies
      const isRefreshTokenAvailable = await AuthModel.findOne({
        refreshToken
      })

      if (!isRefreshTokenAvailable) {
        throw new Error('Refresh Token is not available')
      }

      await AuthModel.findOneAndDelete({
        refreshToken
      })
      return res.status(200).clearCookie('refreshToken').json({
        status: 'success',
        message: 'Logout Successfully'
      })
    } catch (error) {
      return res.status(400).json({
        status: 'fail',
        message: 'Logout request invalid'
      })
    }
  }
}

export default AuthController
