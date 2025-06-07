import './init';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import discountRouter from './routes/discount';
import itemRouter from './routes/item';
import loginRouter from './routes/login';
import priceRouter from './routes/price';
import productRouter from './routes/product';
import registerRouter from './routes/register';
import roleRouter from './routes/role';
import logoutRouter from './routes/logout';
import authRouter from './routes/auth';
import userManagementRouter from './routes/userManagement';
import customizationRouter from './routes/customization';

const BACKEND_PORT = process.env.BACKEND_PORT || 5000;
const corsOpt = {
    origin: "http://localhost:3000",
    credentials: true,
};

const app = express();
app.use(cors(corsOpt));
app.use(cookieParser());
app.use(express.json());

app.use('/discount', discountRouter);
app.use('/item', itemRouter);
app.use('/login', loginRouter);
app.use('/price', priceRouter);
app.use('/product', productRouter);
app.use('/register', registerRouter);
app.use('/role', roleRouter);
app.use('/logout', logoutRouter);
app.use('/auth', authRouter);
app.use('/api', userManagementRouter); // 用戶管理 API
app.use('/customization', customizationRouter);

app.listen(BACKEND_PORT, () => {
    console.log(`Server is running on port ${BACKEND_PORT}`);
});
