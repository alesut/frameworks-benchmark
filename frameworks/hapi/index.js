'use strict';

const Hapi = require('@hapi/hapi');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: '127.0.0.1'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            return { hello: 'world', time: Date.now() }
        }
    });


    server.route({
        method: 'GET',
        path: '/metrics',
        handler: (request, h) => {
            return { memory: process.memoryUsage.rss() }
        }
    });

    server.route({
        method: 'GET',
        path: '/timeout',
        handler: (request, h) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ hello: 'world', time: Date.now() });
                }, 500)
            });
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();