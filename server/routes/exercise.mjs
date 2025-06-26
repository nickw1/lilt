import express from 'express';
import ExerciseController from '../controllers/exercise.mjs';
import db from '../db/db.mjs';

const router = express.Router();
const controller = new ExerciseController(db);

router.post('/new', controller.addExercise.bind(controller));
router.get('/all', controller.getAll.bind(controller));
router.put('/:id(\\d+)', controller.editExercise.bind(controller));
router.put('/:id(\\d+)/questions', controller.addQuestionsToExercise.bind(controller));
router.get('/:id(\\d+)', controller.getFullExercise.bind(controller));
router.delete('/:id(\\d+)', controller.deleteExercise.bind(controller));


export default router;
