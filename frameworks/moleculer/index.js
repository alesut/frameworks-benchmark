let { ServiceBroker } = require("moleculer");
let ApiService = require("moleculer-web");

let broker = new ServiceBroker({ logger: null });

broker.createService({
    mixins: [ApiService],

    settings: {
        routes: [{
            aliases: {
                "GET /"(req, res) {
                    res.end(JSON.stringify({ hello: 'world', time: Date.now() }));
                },
                "GET /metrics"(req, res) {
                    res.end(JSON.stringify({ memory: process.memoryUsage().rss }));
                },
                "GET /timeout"(req, res) {
                    setTimeout(() => {
                        res.end(JSON.stringify({ hello: 'world', time: Date.now() }));
                    }, 500);
                }
            }
        }]
    }
});
// Start server
broker.start();