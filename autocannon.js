'use strict'

import autocannon from 'autocannon'
import fs from 'fs'

const DURATION = 20;
const KILOBYTE = 1024;
const MEGABYTE = 1024 * KILOBYTE;
const METRICS_URL = 'http://127.0.0.1:3000/metrics';
const BENCH_URL = 'http://127.0.0.1:3000/';

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const run = (opts = {}, handler, save) => new Promise(async (resolve, reject) => {
    const MEMORY = {
        before: 0,
        peak: 0,
        after: 0
    }
    MEMORY.before = parseInt((await (await fetch(METRICS_URL)).json()).memory);

    await autocannon({
        url: opts.url || BENCH_URL,
        connections: 100,
        pipelining: 10,
        duration: opts.duration || DURATION
    }).on('tick', async () => {
        try {
            const memoryConsumption = parseInt((await (await fetch(METRICS_URL)).json()).memory);

            if (MEMORY.peak < memoryConsumption) {
                MEMORY.peak = memoryConsumption;
            };
        } catch (error) {
            console.log(error);
        }
    }).on('done', async (result) => {
        await timeout(3000);
        MEMORY.after = parseInt((await (await fetch(METRICS_URL)).json()).memory);

        if (save) {
            const data = {
                name: handler.name,
                memory: {
                    before: MEMORY.before / MEGABYTE,
                    peak: MEMORY.peak / MEGABYTE,
                    after: MEMORY.after / MEGABYTE
                },
                requests: {
                    average: result.requests.average
                },
                latency: {
                    average: result.latency.average
                }
            };

            try {
                await fs.promises.writeFile(`results/${handler.name}.json`, JSON.stringify(data));
                console.log(`Results saved for ${handler.name}`)
            } catch (error) {
                console.log(error);
            }
        }
        resolve(result)
        console.log(`Result of benchmarking ${MEMORY.before} | ${MEMORY.peak} | ${MEMORY.after} | ${result.requests.average} | ${result.latency.average}ms`);
    });
});

export async function fire(opts, handler, save) {
    await run(opts, handler, save);
}
