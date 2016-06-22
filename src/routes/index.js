import express from 'express';
import user from './user.routes';
import destination from './destination.routes';
import travel from './travel.routes';
import { pageNotFoundMiddleware, errorMiddleware } from '../components/errors';

const router = express.Router();

router.use('/users', user);
router.use('/destinations', destination);
router.use('/travels', travel);

router.use(pageNotFoundMiddleware);
router.use(errorMiddleware);

export default router;
