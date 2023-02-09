#!/usr/bin/env node
'use strict'

import { spawn } from 'child_process'
import { fire } from './autocannon.js'
import { fileURLToPath } from 'url'
import { join } from 'path';
import { readFile, writeFile } from 'fs/promises';
import assert from 'assert'

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const FRAMEWORKS_FOLDER = 'frameworks';

const PACKAGES = [
    {
        name: 'express',
    },
    {
        name: 'fastify',
    },
    {
        name: 'node',
    },
    {
        name: 'koa',
    },
    {
        name: 'nest_express',
    },
    {
        name: 'nest_fastify',
    },
    {
        name: 'sails',
    },
    {
        name: 'moleculer',
    },
    {
        name: 'hapi',
    },
    {
        name: 'feathers_koa',
    },
    {
        name: 'feathers_express',
    },
];
process.on('SIGINT', () => {
    console.log('Caught interrupt signal');
    process.exit();
});

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const doBench = async (handler) => {
    const opts = {};
    if (process.argv[2] === 'timeout') {
        opts.url = '127.0.0.1:3000/timeout';
    }
    console.log(`Started ${JSON.stringify(handler)}`);

    const command = ['npm', ['run', 'start'], { cwd: join(__dirname, FRAMEWORKS_FOLDER, handler.name) }];

    const forked = spawn(...command);

    // forked.stdout.on('data', (data) => {
    //     console.log(`stdout: ${data}`);
    // });

    // forked.stderr.on('data', (data) => {
    //     console.error(`stderr: ${data}`);
    // });

    if (handler.name === 'sails') {
        await timeout(5000);
    } else {
        await timeout(1000);
    }

    try {
        console.log(`Warming ${handler.name}`);
        await fire(opts, handler, false);
    } catch (error) {
        return console.log(error)
    }

    try {
        console.log(`Working ${handler.name}`);
        await fire(opts, handler, true);
        console.log('Finished');
        assert.ok(forked.kill('SIGINT'))
        return true
    } catch (error) {
        return console.log(error)
    }
}

async function saveCSV(name, results) {
    const header = ['Framework', 'Requests/sec', 'Latency (ms)', 'Memory before (MB)', 'Memory peak (MB)', 'Memory after (MB)'].join(',') + '\n';
    const csv = results.map((result, index) => {
        return `${result.name},${result.requests.average},${result.latency.average},${result.memory.before},${result.memory.peak},${result.memory.after}`
    }).join('\n');

    await writeFile(join(__dirname, 'results', `${name}.csv`), header + csv);
}

async function compare(timeout = '') {
    const results = await Promise.all(PACKAGES.map(async (handler) => {
        const result = JSON.parse((await readFile(join(__dirname, 'results', `${handler.name}.json`))));
        result.name = handler.name;
        return result;
    }));

    await saveCSV('results' + timeout, results);

    const resultsForPrinting = results.map((result, index) => {
        return {
            name: result.name,
            'Requests/sec': result.requests.average,
            'Latency': `${result.latency.average}ms`,
            'Memory before': `${result.memory.before}MB`,
            'Memory peak': `${result.memory.peak}MB`,
            'Memory after': `${result.memory.after}MB`,
        }
    });
    console.table(resultsForPrinting);
}

let index = 0
const start = async (list) => {
    if (list.length === index) {
        console.log('Finished all benchmarks');

        if (process.argv[2] === 'timeout') {
            return await compare('timeout');
        } else {
            return await compare();
        }
    }

    try {
        await doBench(list[index])
        index += 1
        return start(list)
    } catch (error) {
        return console.log(error)
    }
}
(async () => {
    await start(PACKAGES)
})();

