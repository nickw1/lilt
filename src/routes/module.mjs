import express from 'express';
import ModuleController from '../controllers/module.mjs';

import db from '../db/db.mjs';

const router = express.Router();
const controller = new ModuleController(db);

router.get('/:code/topics', controller.getModuleTopics.bind(controller));
router.get('/:code/topic/:id/updated', controller.getUpdateTime.bind(controller));

export default router;
