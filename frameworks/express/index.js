'use strict'

const express = require('express')

const app = express()

app.disable('etag')
app.disable('x-powered-by')

app.get('/', function (req, res) {
    res.json({ hello: 'world', time: Date.now() });
})

app.get('/metrics', function (req, res) {
    res.json({ memory: process.memoryUsage.rss() });
})

app.get('/timeout', async function (req, res) {
    res.json(await new Promise((resolve) => {
        setTimeout(() => {
            resolve({ hello: 'world', time: Date.now() });
        }, 500)
    }));
})


app.listen(3000)