import http from 'http';
import url from 'url';

const server = http.createServer(handler);

function handler(req, res) {
    const reqURL = url.parse(req.url, true).pathname;
    if (reqURL === '/metrics') {
        metricsHandler(req, res);
    } else if (reqURL === '/') {
        basicHandler(req, res);
    } else if (reqURL === '/timeout') {
        timeoutHandler(req, res);
    } else {
        res.writeHead(404);
        res.end();
    }
}

function metricsHandler(req, res) {
    res.writeHead(200);
    res.end(JSON.stringify({ memory: process.memoryUsage.rss() }));
}

function basicHandler(req, res) {
    res.writeHead(200);
    res.end(JSON.stringify({ hello: 'world', time: Date.now() }));
}

async function timeoutHandler(req, res) {
    res.writeHead(200);
    res.end(JSON.stringify(await new Promise((resolve) => {
        setTimeout(() => {
            resolve({ hello: 'world', time: Date.now() });
        }, 500)
    })));
}


server.listen(3000);