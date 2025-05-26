import express from 'express';
import { getUserRole } from '../models/role';
import jwt from 'jsonwebtoken';
import { db } from '../database/db';

const JWT_TOKEN = process.env.JWT_TOKEN || 'your-default-secret-key';

const roleRouter = express.Router();

// backend/routes/role.ts
roleRouter.get('/getRole', (async (req, res, next) => {
    try {
      // 从Authorization header中获取token
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
      }
      
      const token = authHeader.substring(7);

      const userRole = await getUserRoleByToken(token);
      
      if (!userRole) {
        res.status(404).json({ message: 'User role not found' });
        return;
      }
      
      res.status(200).json({ role_id: userRole.role_id });
    } catch (error) {
      console.error('Error fetching user role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
}) as express.RequestHandler);


export async function getUserRoleByToken(token: string) {
    return await db
        .selectFrom('session')
        .innerJoin('user', 'session.user_id', 'user.id')
        .where('session.token', '=', token)
        .select('user.role_id')
        .executeTakeFirst();

        roleRouter
}



export default roleRouter;
