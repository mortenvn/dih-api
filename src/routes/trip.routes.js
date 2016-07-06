import express from 'express';
import { authorize } from '../components/auth';
import * as controller from '../controllers/trip.controller';

const router = express.Router();

router.get('/', controller.list);

router.get('/:id', authorize, controller.retrieve);

router.post('/', authorize, controller.create);

router.delete('/:id', controller.destroy);

router.put('/:id', authorize, controller.update);

export default router;
