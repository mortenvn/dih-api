import express from 'express';
import * as controller from '../controllers/travel.controller';

const router = express.Router();

router.get('/', controller.list);

router.post('/', controller.create);

router.delete('/:id', controller.destroy);

router.put('/:id', controller.update);

export default router;
