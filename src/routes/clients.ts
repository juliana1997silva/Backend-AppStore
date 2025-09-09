import express from 'express';
import { details, images, list, notification, search } from '../controllers';

const router = express.Router();

router.get('/list', list);
router.get('/details/:name', details);
router.get('/search', search);
router.get('/images', images);
router.get('/notification', notification);

export default router;