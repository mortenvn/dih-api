import express from 'express';
import { authorize, verifyAdministrator } from '../components/auth';
import * as controller from '../controllers/user.controller';

const router = express.Router();

router.get('/', controller.list);

router.get('/:id', controller.retrieve);

router.put('/:id', authorize, verifyAdministrator, controller.update);

router.post('/', controller.create);

export default router;
