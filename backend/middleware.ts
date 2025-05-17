import { Request, Response, NextFunction } from 'express';

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
