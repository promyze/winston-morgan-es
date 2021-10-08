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
    
    const morganJSONFormat = () => JSON.stringify({
        method: ':method',
        url: ':url',
        http_version: ':http-version',
        remote_addr: ':remote-addr',
        response_time: ':response-time',
        status: ':status',
        content_length: ':res[content-length]',
        timestamp: ':date[iso]',
        user_agent: ':user-agent',
    });
    app.use(morgan(morganJSONFormat()));

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