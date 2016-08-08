import express from 'express';
import { authorizeModerator } from '../components/auth';
import send from '../controllers/message.controller';

const router = express.Router();

router.post('/', authorizeModerator, send);

export default router;
