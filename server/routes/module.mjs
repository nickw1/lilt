import express from 'express';
import ModuleController from '../controllers/module.mjs';

const router = express.Router();
const moduleController = new ModuleController();

router.get('/all', moduleController.getAll.bind(moduleController));
router.post('/new', moduleController.addModule.bind(moduleController));

export default router;
