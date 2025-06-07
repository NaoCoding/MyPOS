import jwt from 'jsonwebtoken';
import { findUserSession } from './models/user';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { getUserRoleByToken } from './routes/role';

// 擴展 Request 介面以包含用戶資訊
declare global {
  namespace Express {
    interface Request {
      user?: {
        role_id: number;
        token: string;
      };
    }
  }
}

// 驗證用戶是否已登入
export const requireAuth: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      res.status(401).json({ message: '請先登入' });
      return;
    }

    const userRole = await getUserRoleByToken(token);
    
    if (!userRole) {
      res.status(401).json({ message: '無效的登入狀態' });
      return;
    }

    // 將用戶資訊附加到 request 物件
    req.user = {
      role_id: userRole ? userRole.role_id : 1, 
      token: token
    };

    next();
    return;

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
  
};

// 驗證用戶是否為特定角色（role_id = 2）
export const requireClerk: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({ message: '請先登入' });
    return;
  }

  if (req.user.role_id < 2) {
    res.status(403).json({ message: '權限不足，僅限特定角色使用' });
    return;
  }

  next();
  return;
};

// 組合中間件：要求登入且為特定角色（role_id = 2）
export const requireRoleTwoAuth = [requireAuth, requireClerk];

// 驗證用戶是否為管理員
export const requireManager: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({ message: '請先登入' });
    return;
  }

  else if (req.user.role_id !== 4) {
     res.status(403).json({ message: '權限不足，僅限管理員使用' });
     return;
  }

  

  next();
  return;
  
};

// 組合中間件：要求登入且為管理員
export const requireManagerAuth = [requireAuth, requireManager];

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
