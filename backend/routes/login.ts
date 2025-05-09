import { Router, Request, Response } from 'express';

interface User {
    username: string;
    password: string;
}

// TODO: connect to the database and get the user data
const users: User[] = [
    { username: 'admin', password: '12345678' },
    { username: 'user',  password: 'password' },
];

const loginRouter = Router();

loginRouter.post('/login', (req: Request, res: Response) => {
    try {
        const authToken = req.cookies.token;

        if (authToken) {
            res.status(400).json({
                message: "已登入",
            });
            return;
        };

        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({
                message: "請輸入用戶名和密碼",
            });
            return;
        }

        // TODO: connect to the database and get the user data
        const user = users.find((u) => u.username === username && u.password === password);
        if (!user) {
            res.status(401).json({
                message: "用戶名或密碼錯誤",
            });
            return;
        }

        res.status(200).json({
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
