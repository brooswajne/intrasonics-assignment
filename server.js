import express from 'express';

import { PORT } from './server/config.js';
import { logger } from './server/logger.js';

const app = express( );

app.get('/', function getGreeting(_, res) {
	res.send('Hello world');
});

app.listen(PORT, function onceListening( ) {
	logger.info(`Server started successfully. Listening on port ${PORT}.`);
});
