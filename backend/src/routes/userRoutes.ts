import { RequestHandler, Router } from 'express'
import UserController from '../controllers/userController'
import { verifyToken, AuthRequest } from '../middleware/authMiddleware'

const router = Router()

router.get('/:username', verifyToken as RequestHandler, async (req: AuthRequest, res, next) => {
    try {
        await UserController.getUser(req, res, next);
    } catch (error) {
        next(error);
    }
});

router.delete('/:username', UserController.deleteUser)

export default router