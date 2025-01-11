import express from 'express';
import NotesController from '../controllers/notes.mjs';
import db from '../db/db.mjs';


const router = express.Router();
const notesController = new NotesController(db);

router.get('/:module/:topic(\\d+).json', notesController.loadNotes.bind(notesController));

export default router;
