import express from 'express';
import UserController from '../controllers/user.mjs';
import db from '../db/db.mjs';

const router = express.Router();
const controller = new UserController(db);

router.post('/new', controller.addUser.bind(controller));
router.post('/login', controller.login.bind(controller));
router.get('/login', controller.checkLogin.bind(controller));
router.post('/logout', controller.logout.bind(controller));

router.post('/admin/login', controller.adminLogin.bind(controller));
router.get('/admin/login', controller.getAdminLogin.bind(controller));

export default router;
