const express = require('express');
const http = require('http');
const morgan = require('morgan');
const winston = require('winston');

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'info',
            json: true
        })
    ]
});

function startServer() {
    const app = express();
    app.use(morgan('combined'));

	app.get('/', (req, res) => {
        logger.info("Hi there !");
	    res.status(200).json({});
    });

    const server = http.createServer(app);

    server.listen(3001, () => {
        logger.info("Server listens on 3001");
    });
}

startServer();