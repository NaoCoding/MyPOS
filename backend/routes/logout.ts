import express from 'express';
import { db } from '../database/db';

const logoutRouter = express.Router();

logoutRouter.post('/', async (req, res) => {
  try {
    const token = req.cookies.token; // 從 httpOnly cookie 中讀取 token
    
    if (!token) {
      res.status(401).json({ message: 'No token provided' });
    }

    // 刪除資料庫中的 session
    await db
      .deleteFrom('session')
      .where('session.token', '=', token)
      .execute();

    // 清除 httpOnly cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default logoutRouter;