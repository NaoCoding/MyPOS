import './init';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import itemRouter from './routes/item';
import loginRouter from './routes/login';
import productRouter from './routes/product';
import registerRouter from './routes/register';
import storeRouter from './routes/store';

const BACKEND_PORT = process.env.BACKEND_PORT || 5000;
const corsOpt = {
    origin: "http://localhost:3000",
    credentials: true,
};

const app = express();
app.use(cors(corsOpt));
app.use(cookieParser());
app.use(express.json());

app.use('/item', itemRouter);
app.use('/login', loginRouter);
app.use('/product', productRouter);
app.use('/register', registerRouter);
app.use('/store', storeRouter);

app.listen(BACKEND_PORT, () => {
    console.log(`Server is running on port ${BACKEND_PORT}`);
});
