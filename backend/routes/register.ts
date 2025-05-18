import { Router, Request, Response } from 'express';
import { createUser, findUser } from '../models/user';
import bcrypt from 'bcrypt';

import { checkNotLogin } from '../middleware';

const registerRouter = Router();

let BCRYPT_SALT_ROUNDS = 10;
if (process.env.BCRYPT_SALT_ROUNDS !== undefined) {
    BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS);
    if (isNaN(BCRYPT_SALT_ROUNDS)) {
        BCRYPT_SALT_ROUNDS = 10;
    }
}

registerRouter.post('/', checkNotLogin, async (req: Request, res: Response) => {
    const { username, email, telephone, password } = req.body;

    // Validate request body
    if (!username || !email || !telephone || !password) {
        res.status(400).json({
            message: "所有欄位都是必填"
        });
        return;
    }

    try {
        if (await findUser({ username })) {
            res.status(400).json({
                message: "用戶名已存在"
            });
            return;
        }
        else if (await findUser({ email })) {
            res.status(400).json({
                message: "電子郵件已存在"
            });
            return;
        }

        const user = await createUser({
            username,
            email,
            telephone,
            password: await bcrypt.hash(password, BCRYPT_SALT_ROUNDS),
        });

        res.status(201).json({
            message: "用戶創建成功"
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            message: "伺服器錯誤"
        });
    }
});

export default registerRouter;
