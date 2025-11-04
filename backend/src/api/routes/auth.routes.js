import { Router } from 'express';
import { check } from 'express-validator';
import { signup, login, getMe , logout} from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = Router();

router.post(
  '/signup',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  ],
  signup
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  login
);

router.get('/me', requireAuth, getMe);
router.post('/logout', requireAuth, logout);
export default router;