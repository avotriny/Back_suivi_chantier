// routes/userRouter.js
import { Router } from 'express';
import register from '../controllers/userController.js';
import login from '../controllers/login.js';
import updateProfile from '../controllers/updateProfile.js';
import { auth } from '../middleware/auth.js';
import { getUsers } from '../controllers/getUsers.js';
import updateStatus from '../controllers/updateStatus.js';
import checkAccess from '../middleware/checkAccess.js';
import userPermissions from '../middleware/permissions/user/userPermissions.js';

const userRouter = Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.patch('/updateProfile', auth, updateProfile);
userRouter.get('/', auth, checkAccess(userPermissions.listUsers), getUsers);
userRouter.patch('/updateStatus/:userId', auth, checkAccess(userPermissions.updateStatus), updateStatus);

export default userRouter;
