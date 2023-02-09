'use strict'

const fastify = require('fastify')();

const schema = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    hello: {
                        type: 'string'
                    },
                    time: {
                        type: 'number'
                    }
                }
            }
        }
    }
}

fastify.get('/', schema, function (req, reply) {
    reply.send({ hello: 'world', time: Date.now() })
});


fastify.get('/timeout', schema, async function (req, reply) {
    reply.send(await new Promise((resolve) => {
        setTimeout(() => {
            resolve({ hello: 'world', time: Date.now() });
        }, 500)
    }));
});

const schemaForMetrics = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    memory: {
                        type: 'number'
                    }
                }
            }
        }
    }
}
fastify.get('/metrics', schemaForMetrics, function (req, reply) {
    reply.send({ memory: process.memoryUsage.rss() })
});

fastify.listen({ port: 3000, host: '127.0.0.1' })
