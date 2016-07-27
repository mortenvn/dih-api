import express from 'express';
import account from './account.routes';
import user from './user.routes';
import authenticate from './authenticate.routes';
import destination from './destination.routes';
import mailTemplate from './mailTemplate.routes';
import trip from './trip.routes';
import { pageNotFoundMiddleware, errorMiddleware } from '../components/errors';

const router = express.Router();

router.use('/authenticate', authenticate);
router.use('/account', account);
router.use('/users', user);
router.use('/destinations', destination);
router.use('/trips', trip);
router.use('/mailtemplates', mailTemplate);

router.use(pageNotFoundMiddleware);
router.use(errorMiddleware);

export default router;
