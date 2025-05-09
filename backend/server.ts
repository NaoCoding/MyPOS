// load environment variables before importing other modules
import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import loginRouter from './routes/login';

const BACKEND_PORT = process.env.BACKEND_PORT || 5000;
const corsOpt = {
    origin: "http://localhost:3000",
    credentials: true,
};

const app = express();
app.use(cors(corsOpt));
app.use(cookieParser());
app.use(express.json());

app.use(loginRouter);

app.listen(BACKEND_PORT, () => {
    console.log(`Server is running on port ${BACKEND_PORT}`);
});
