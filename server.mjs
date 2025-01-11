import express from 'express';

import { reactServer } from '@lazarv/react-server/dev';

const app = express();

const PORT = 3000;

const server = await reactServer();

app.use('/api', async(req, res, next) => {
	res.send("api");
});

app.use('/', async(req, res, next) => {
	const { middlewares } = await server;
	middlewares(req, res, next);
});

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}.`);
});
