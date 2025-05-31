import express, { RequestHandler } from 'express';
import { getUsers, findUser, createUser } from '../models/user';
import { db } from '../database/db';
import bcrypt from 'bcrypt';
import { requireAuth, requireManager } from '../middleware';

const userManagementRouter = express.Router();

let BCRYPT_SALT_ROUNDS = 10;
if (process.env.BCRYPT_SALT_ROUNDS !== undefined) {
    BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS);
    if (isNaN(BCRYPT_SALT_ROUNDS)) {
        BCRYPT_SALT_ROUNDS = 10;
    }
}

// 獲取所有用戶 - 需要管理員權限
const getUsersHandler: RequestHandler = async (req, res) => {
    try {
        console.log(`管理員 (role_id: ${req.user?.role_id}) 正在查看用戶列表`);
        
        const users = await getUsers();
        // 不返回密碼
        const safeUsers = users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            telephone: user.telephone,
            role_id: user.role_id,
            created_at: user.created_at
        }));
        
        res.status(200).json(safeUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: '伺服器錯誤' });
    }
};

// 創建新用戶 - 需要管理員權限
const createUserHandler: RequestHandler = async (req, res) => {
    const { username, email, telephone, password, role_id } = req.body;

    if (!username || !email || !telephone || !password || !role_id) {
        res.status(400).json({ message: '所有欄位都是必填' });
        return;
    }

    try {
        console.log(`管理員 (role_id: ${req.user?.role_id}) 正在創建新用戶: ${username}`);
        
        // 檢查用戶是否已存在
        if (await findUser({ username })) {
            res.status(400).json({ message: '用戶名已存在' });
            return;
        }
        if (await findUser({ email })) {
            res.status(400).json({ message: '電子郵件已存在' });
            return;
        }

        // 驗證角色 ID 是否有效
        if (![1, 4].includes(parseInt(role_id))) {
            res.status(400).json({ message: '無效的角色 ID' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
        
        const newUser = await createUser({
            username,
            email,
            telephone,
            password: hashedPassword,
            role_id: parseInt(role_id)
        });

        res.status(201).json({ 
            message: '用戶創建成功', 
            userId: Number(newUser.insertId)
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: '伺服器錯誤' });
    }
};

// 更新用戶 - 需要管理員權限
const updateUserHandler: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const { username, email, telephone, role_id, password } = req.body;

    try {
        console.log(`管理員 (role_id: ${req.user?.role_id}) 正在更新用戶 ID: ${id}`);
        
        const existingUser = await findUser({ id: parseInt(id) });
        if (!existingUser) {
            res.status(404).json({ message: '用戶不存在' });
            return;
        }

        // 檢查是否嘗試修改用戶名或郵件為已存在的值
        if (username && username !== existingUser.username) {
            const userWithSameName = await findUser({ username });
            if (userWithSameName && userWithSameName.id !== parseInt(id)) {
                res.status(400).json({ message: '用戶名已存在' });
                return;
            }
        }

        if (email && email !== existingUser.email) {
            const userWithSameEmail = await findUser({ email });
            if (userWithSameEmail && userWithSameEmail.id !== parseInt(id)) {
                res.status(400).json({ message: '電子郵件已存在' });
                return;
            }
        }

        const updateData: any = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (telephone) updateData.telephone = telephone;
        if (role_id) {
            // 驗證角色 ID 是否有效
            if (![1, 4].includes(parseInt(role_id))) {
                res.status(400).json({ message: '無效的角色 ID' });
                return;
            }
            updateData.role_id = parseInt(role_id);
        }
        if (password) {
            updateData.password = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
        }

        await db
            .updateTable('user')
            .set(updateData)
            .where('id', '=', parseInt(id))
            .execute();

        res.status(200).json({ message: '用戶更新成功' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: '伺服器錯誤' });
    }
};

// 刪除用戶 - 需要管理員權限
const deleteUserHandler: RequestHandler = async (req, res) => {
    const { id } = req.params;

    try {
        console.log(`管理員 (role_id: ${req.user?.role_id}) 正在刪除用戶 ID: ${id}`);
        
        const existingUser = await findUser({ id: parseInt(id) });
        if (!existingUser) {
            res.status(404).json({ message: '用戶不存在' });
            return;
        }

        // 刪除用戶相關的 session
        await db
            .deleteFrom('session')
            .where('user_id', '=', parseInt(id))
            .execute();

        // 刪除用戶
        await db
            .deleteFrom('user')
            .where('id', '=', parseInt(id))
            .execute();

        res.status(200).json({ message: '用戶刪除成功' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: '伺服器錯誤' });
    }
};

userManagementRouter.get('/users', requireAuth, requireManager, getUsersHandler);
userManagementRouter.post('/users', requireAuth, requireManager, createUserHandler);
userManagementRouter.put('/users/:id', requireAuth, requireManager, updateUserHandler);
userManagementRouter.delete('/users/:id', requireAuth, requireManager, deleteUserHandler);

export default userManagementRouter;
