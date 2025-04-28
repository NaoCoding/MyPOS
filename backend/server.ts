import express from 'express'
import cors from 'cors'

const corsOpt = {
    origin: "http://localhost:3000",
    credentials: true,
}

const app = express()
app.use(cors(corsOpt))
app.use(express.json())

app.listen(5000, () => {
    console.log('Server is running on port 3001')
});