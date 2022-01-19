import express from 'express';

const app = express( );

const DEFAULT_PORT = 3000;

app.get('/', function getGreeting(_, res) {
	res.send('Hello world');
});

app.listen(DEFAULT_PORT, function onceListening( ) {
	console.log('App started');
});
