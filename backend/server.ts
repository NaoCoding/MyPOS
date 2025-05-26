import './init';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import loginRouter from './routes/login';
import registerRouter from './routes/register';
import roleRouter from './routes/role';
import logoutRouter from './routes/logout';
import authRouter from './routes/auth';

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
app.use('/role', roleRouter);
app.use('/logout', logoutRouter);
app.use('/auth', authRouter);

app.listen(BACKEND_PORT, () => {
    console.log(`Server is running on port ${BACKEND_PORT}`);
});
