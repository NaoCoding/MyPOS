import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { findUser } from '../models/user';
import { createOrUpdateSession } from '../models/session';

const loginRouter = Router();
const JWT_TOKEN   = process.env.JWT_TOKEN;
if (!JWT_TOKEN) {
    throw new Error("JWT_TOKEN is not defined in .env file");
}

let JWT_TOKEN_EXPIRY_DAYS = 30;
if (process.env.JWT_TOKEN_EXPIRY_DAYS !== undefined) {
    JWT_TOKEN_EXPIRY_DAYS = parseInt(process.env.JWT_TOKEN_EXPIRY_DAYS);
    if (isNaN(JWT_TOKEN_EXPIRY_DAYS) || JWT_TOKEN_EXPIRY_DAYS <= 0) {
        throw new Error("JWT_TOKEN_EXPIRY_DAYS is not a valid number in .env file");
    }
}

loginRouter.post('/login', async (req: Request, res: Response) => {
    const authToken = req.cookies.token;

    if (authToken) {
        res.status(400).json({
            message: "已登入",
        });
        return;
    }

    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({
            message: "請輸入用戶名和密碼",
        });
        return;
    }

    try {
        const user = await findUser({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({
                message: "用戶名或密碼錯誤",
            });
            return;
        }

        // Generate JWT token
        let expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + JWT_TOKEN_EXPIRY_DAYS);

        const newToken = jwt.sign({ username: user.username }, JWT_TOKEN, {
            expiresIn: `${JWT_TOKEN_EXPIRY_DAYS}d`,
        });

        // TODO: insert the token into the database
        await createOrUpdateSession({
            user_id: user.id,
            token: newToken,
            expired_at: expiryDate.toISOString(),
        });

        // Set the token in the cookie and send the response
        res.status(200)
        .cookie('token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: expiryDate,
        })
        .json({
            message: "登入成功",
            user: { username: user.username },
        });
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            message: "伺服器錯誤"
        });
    }
});

export default loginRouter;
