import express from 'express';
import { authorize } from '../components/auth';
import * as controller from '../controllers/account.controller';

const router = express.Router();

router.get('/', authorize, controller.show);

export default router;
