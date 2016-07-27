import express from 'express';
import * as controller from '../controllers/mailTemplate.controller';
import { authorize } from '../components/auth';

const router = express.Router();

router.get('/', controller.list);

router.get('/:id', authorize, controller.retrieve);

router.post('/', controller.create);

router.delete('/:id', controller.destroy);

router.put('/:id', controller.update);

export default router;
