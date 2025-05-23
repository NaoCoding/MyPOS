import './init';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import loginRouter from './routes/login';
import registerRouter from './routes/register';

const BACKEND_PORT = process.env.BACKEND_PORT || 5000;
const corsOpt = {
    origin: "http://localhost:3000",
    credentials: true,
};

const app = express();
app.use(cors(corsOpt));
app.use(cookieParser());
app.use(express.json());

app.use('/login', loginRouter);
app.use('/register', registerRouter);

app.listen(BACKEND_PORT, () => {
    console.log(`Server is running on port ${BACKEND_PORT}`);
});
