import express from 'express'
import UsersController from '../controllers/UsersController.js'

// middlewares
import validateRegisterPayload from '../middlewares/validateRegisterPayload.js'
import AuthController from '../controllers/AuthController.js'
import validateAuth from '../middlewares/validateAuth.js'

const router = express.Router()

// USERS
router.post('/users', validateRegisterPayload, UsersController.addUser)
router.get('/users/:id', validateAuth, UsersController.getUserById)

// AUTH
router.post('/auth', AuthController.getToken)
router.get('/auth', AuthController.putToken)
router.delete('/auth', AuthController.removeToken)

export default router
