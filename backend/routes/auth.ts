import express from 'express';
import { getUserRoleByToken } from './role';

const authRouter = express.Router();

// 檢查登入狀態的 API
authRouter.get('/checkAuth', async (req, res) => {
  try {
    const token = req.cookies.token; // 從 httpOnly cookie 中讀取 token
    
    if (!token) {
      res.status(401).json({ authenticated: false });
    }

    // 檢查 token 是否有效並獲取角色
    const userRole = await getUserRoleByToken(token);
    
    if (!userRole) {
      res.status(200).json({ authenticated: false });
    }

    res.status(200).json({ 
      authenticated: true, 
      role_id: userRole ? userRole.role_id : 1,
      token: token // 將 token 返回給前端
    });
  } catch (error) {
    console.error('Error checking auth:', error);
    res.status(500).json({ authenticated: false });
  }
});

export default authRouter;