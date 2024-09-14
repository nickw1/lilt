import express from 'express';
import PageController from '../controllers/page.mjs';
import db from '../db/db.mjs';


const router = express.Router();
const pageController = new PageController(db);

router.get('/:topic(\\d+).json', pageController.loadPage.bind(pageController));

export default router;
