import { Router, Request, Response } from 'express';


interface User {
username: string;
password: string;
}

//ToDo : connect to the database and get the user data
const users: User[] = [
{ username: 'admin', password: '123456' },
{ username: 'user', password: 'password' },
];

const loginRouter = Router();

loginRouter.post('/login', (req: Request, res: Response) => {
const { username, password } = req.body;

const user = users.find(
    (u) => u.username === username && u.password === password
);

//ToDo : return session id and token
if (user) {
    res.status(200).json({ message: '登入成功', user: { username: user.username } });
} else {
    res.status(401).json({ message: '用戶名或密碼錯誤' });
}
});


export default loginRouter;