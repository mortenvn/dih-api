import express from 'express';
import * as controller from '../controllers/destination.controller';
import { authorizeAdministrator, authorize } from '../components/auth';

const router = express.Router();

router.get('/', authorize, controller.list);

router.get('/:id', authorize, controller.retrieve);

router.post('/', authorizeAdministrator, controller.create);

router.delete('/:id', authorizeAdministrator, controller.destroy);

router.put('/:id', authorizeAdministrator, controller.update);

export default router;
