'use strict'

const Koa = require('koa');

const app = new Koa();

app.use(async ctx => {
    if (ctx.request.path === '/metrics') {

        ctx.body = { memory: process.memoryUsage().rss };
    } else if (ctx.request.path === '/') {
        ctx.body = { hello: 'world', time: Date.now() };
    } else if (ctx.request.path === '/timeout') {
        ctx.body = await new Promise((resolve) => {
            setTimeout(() => {
                resolve({ hello: 'world', time: Date.now() });
            }, 500)
        });
    } else {
        ctx.status = 404;
    }
});

const _server = app.listen(3000, '127.0.0.1');

process.on('SIGINT', () => {
    _server.close();
});
