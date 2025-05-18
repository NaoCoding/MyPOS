import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { findUserSession } from './models/user';

export function checkNotLogin(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;

    if (token) {
        res.status(400).json({
            message: "已登入",
        });
        return;
    }

    next();
}

export async function checkLogin(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;

    if (!token) {
        res.status(400).json({
            message: "未登入",
        });
        return;
    }

    try {
        const JWT_TOKEN = process.env.JWT_TOKEN;
        if (!JWT_TOKEN) {
            throw new Error("JWT_TOKEN is not defined in .env file");
        }

        const decoded = jwt.verify(token, JWT_TOKEN);

        if (!decoded || typeof decoded === 'string' || !('username' in decoded)) {
            throw new Error("Invalid token payload");
        }

        const userSession = await findUserSession({ username: decoded.username });

        if (!userSession || userSession.token !== token) {
            res.clearCookie('token');
            throw new Error("User session not found or token mismatch");
        }
    }
    catch (error) {
        console.error("JWT verification error:", error);
        res.status(401).json({
            message: "token 驗證失敗",
        });
        return;
    }

    next();
}
