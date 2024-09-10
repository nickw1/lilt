import express from 'express';
import AnswerController from '../controllers/answer.mjs';
import db from '../db/db.mjs';

const router = express.Router();
const controller = new AnswerController(db);

router.post('/new', controller.answerQuestion.bind(controller));
router.post('/:id(\\d+)/authorise', controller.authoriseAnswer.bind(controller));
router.get('/exercise/:eid(\\d+)', controller.getAnswersForExercise.bind(controller));


export default router;
