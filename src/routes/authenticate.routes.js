import express from 'express';
import { authorize } from '../components/auth';
import * as controller from '../controllers/authenticate.controller';

const router = express.Router();

router.post('/', controller.login);
router.post('/password', authorize, controller.setPassword);

export default router;
