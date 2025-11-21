import express from 'express';
import ExerciseController from '../controllers/exercise.mjs';

import db from '../db/db.mjs';

const router = express.Router();
const controller = new ExerciseController(db);

router.get('/:id', controller.getExerciseById.bind(controller));
router.get('/:id/answers', controller.getAnswersForExercise.bind(controller));

export default router;
