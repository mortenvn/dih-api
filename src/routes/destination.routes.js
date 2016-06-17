import express from 'express';
import * as controller from '../controllers/destination.controller';

const router = express.Router();

router.get('/', controller.list);

router.post('/', controller.create);

router.delete('/:id', controller.remove);

router.put('/:id', controller.update);

export default router;
