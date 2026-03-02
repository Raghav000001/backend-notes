import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config({path:"./.env"})

export const app = express()

app.use(express.json({limit:"16kb"}))
app.use(urlencoded({limit:"16kb"}))
app.use(cookieParser())

 app.use(cors({
     origin:process.env.ORIGIN
 }))
  

//  import router
import healthCheckRouter from './routes/healthCheck.route.js'
import authRouter from './routes/auth.router.js'


// use routes
app.use("/api/v1",healthCheckRouter)
app.use("/api/v1/auth",authRouter)

