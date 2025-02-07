import express from 'express';
import QuestionController from '../controllers/question.mjs';
import db from '../db/db.mjs';

const router = express.Router();
const controller = new QuestionController(db);

router.put('/:id(\\d+)', controller.editQuestion.bind(controller));
router.delete('/:id(\\d+)', controller.deleteQuestion.bind(controller));

export default router;
