import express from 'express';

import { logger } from './server/logger.js';

const DEFAULT_PORT = 3000;

const app = express( );

app.get('/', function getGreeting(_, res) {
	res.send('Hello world');
});

app.listen(DEFAULT_PORT, function onceListening( ) {
	logger.info(`Server started successfully. Listening on port ${DEFAULT_PORT}.`);
});
