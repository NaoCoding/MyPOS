import express from 'express'
import cors from 'cors'
import loginRouter from './routes/login'
import cookieParser from 'cookie-parser'

const corsOpt = {
    origin: "http://localhost:3000",
    credentials: true,
}

const app = express()
app.use(cors(corsOpt))
app.use(cookieParser())
app.use(express.json())

app.use(loginRouter)

app.listen(5000, () => {
    console.log('Server is running on port 3001')
});