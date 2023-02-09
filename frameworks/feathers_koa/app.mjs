import { feathers } from '@feathersjs/feathers'
import { koa, rest } from '@feathersjs/koa'

class MessageService {
    async find() {
        return { hello: 'world', time: Date.now() }
    }

    async get(id) {
        if (id === 'metrics') {
            return { memory: process.memoryUsage.rss() }
        } else if (id === 'timeout') {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ hello: 'world', time: Date.now() });
                }, 500)
            });
        }
    }
}

const app = koa(feathers())

app.configure(rest())
app.use('/', new MessageService())

app.listen(3000).then(() => console.log('Feathers server listening on localhost:3000'))
