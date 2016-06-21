import express from 'express';
import account from './account.routes';
import user from './user.routes';
import destination from './destination.routes';
import { pageNotFoundMiddleware, errorMiddleware } from '../components/errors';

const router = express.Router();

router.use('/account', account);
router.use('/users', user);
router.use('/destinations', destination);

router.use(pageNotFoundMiddleware);
router.use(errorMiddleware);

export default router;
