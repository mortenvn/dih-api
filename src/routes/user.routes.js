import express from 'express';
import * as controller from '../controllers/user.controller';

const router = express.Router();

router.get('/', controller.list);

router.get('/:id', controller.retrieve);

router.post('/', controller.create);

export default router;
