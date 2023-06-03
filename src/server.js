import express from 'express'
import dotenv from 'dotenv'
import router from './routers/index.js'
import db from './database/db.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()
const port = process.env.PORT

db.connect(process.env.MONGODB_HOST)
  .then(() => {
    console.log('DB connected')
  })
  .catch((err) => {
    console.log(err)
  })

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: ['http://localhost'],
    credentials: true
  })
)

app.use('/', router)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
