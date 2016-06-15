import express from 'express';
import user from './user.routes';
import { pageNotFoundMiddleware, errorMiddleware } from '../components/errors';

const router = express.Router();

router.use('/users', user);

router.use(pageNotFoundMiddleware);
router.use(errorMiddleware);

export default router;
