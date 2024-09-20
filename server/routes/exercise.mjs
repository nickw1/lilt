import express from 'express';
import ExerciseController from '../controllers/exercise.mjs';
import db from '../db/db.mjs';

const router = express.Router();
const controller = new ExerciseController(db);

router.post('/new', controller.addExercise.bind(controller));
router.get('/all', controller.getAll.bind(controller));


export default router;
