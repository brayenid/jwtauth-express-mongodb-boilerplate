import { nanoid } from 'nanoid'
import UsersModel from '../models/UsersModel.js'
import bcrypt from 'bcrypt'

const UsersController = {
  async addUser(req, res) {
    const { name, username, password } = req.body
    const usernameReplace = username.trim().replace(/\s/g, '')
    const payload = {
      id: `user-${nanoid(12)}`,
      name,
      username: usernameReplace,
      password: await bcrypt.hash(password, 10)
    }
    const newUser = new UsersModel(payload)
    try {
      await newUser.save()
      res.status(201).json({
        status: 'success',
        message: 'Account created successfully!'
      })
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message
      })
    }
  },
  async getUsers(req, res) {
    try {
      const response = await UsersModel.find().select('id name username')
      return res.status(200).json({
        status: 'success',
        data: [...response]
      })
    } catch (error) {
      return res.status(500).json({
        status: 'fail',
        message: 'server error'
      })
    }
  },
  async getUserById(req, res) {
    const { id } = req.params
    const isAuthorized = () => {
      if (id === req.user.id || req.user.role === 'admin') {
        return true
      }
      return false
    }

    try {
      if (!isAuthorized()) {
        throw new Error('You are unauthorized')
      }

      const data = await UsersModel.findOne({
        id
      }).select('id name username')

      return res.status(200).json({
        status: 'success',
        data
      })
    } catch (error) {
      return res.status(403).json({
        status: 'fail',
        message: error.message
      })
    }
  }
}

export default UsersController
