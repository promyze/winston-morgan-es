const express = require('express');
const http = require('http');
const morgan = require('morgan');
const winston = require('winston');
const userAgentParser = require('ua-parser-js');

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
        remote_addr_forwarded: ':req[x-forwarded-for]', //Get a specific header
        response_time: ':response-time',
        status: ':status',
        content_length: ':res[content-length]',
        timestamp: ':date[iso]',
        user_agent: ':user-agent',
    });

    app.use(morgan(morganJSONFormat(), {
        'stream': {
            write: (message) => {
                const data = JSON.parse(message);
                parseUserAgent(data);
                sanitizeUrl(data);
                return logger.info("accesslog", data);
            }
        }
    }));

    function parseUserAgent(data) {
        if (data.user_agent) {
            const ua = userAgentParser(data.user_agent);
            if (ua.browser) {
                data.user_agent_browser_name = ua.browser.name;
                data.user_agent_browser_version = ua.browser.major || ua.browser.version;
            }
            if (ua.os) {
                data.user_agent_os_name = ua.os.name;
                data.user_agent_os_version = ua.os.version;
            }
        }
    }

    function sanitizeUrl(data) {
        if (!data.url) {
            return;
        }
        const regex = /\/[0-9]+/g;
        const urlWithoutParameter = data.url.replace(regex, '/:id');
        data.url_sanitized = urlWithoutParameter;
    }

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