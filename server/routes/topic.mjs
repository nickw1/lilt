import express from 'express';
import TopicController from '../controllers/topic.mjs';

const router = express.Router();

const topicController = new TopicController();

router.get('/all', topicController.getAll.bind(topicController));
router.get('/:moduleCode([\\d\\w]+)/all', topicController.getAllForModule.bind(topicController));
router.post('/new', topicController.addTopic.bind(topicController));
router.get('/:moduleCode([\\d\\w]+)/:topicNum(\\d+).json', topicController.getTopicByModuleCodeAndNumber.bind(topicController));
router.post('/:id(\\d+)/makePublic', topicController.makePublic.bind(topicController));

export default router;
