import { Router } from 'express';
import { router as uploads } from './upload';

const router = Router();

router.use('/', uploads);

export { router };