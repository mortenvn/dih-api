import express from 'express';
import * as controller from '../controllers/destination.controller';

const router = express.Router();

router.get('/', controller.list);

export default router;
