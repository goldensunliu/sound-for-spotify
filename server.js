import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress } from 'apollo-server-express';
import compression from 'compression'
import next from 'next'
import cookieParser from 'cookie-parser'

import { makeSchema } from './graphqllib'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = parseInt(process.env.PORT, 10) || 3000

const checkLogin = (req, res, next) => {
        if (!req.cookies['spotify-token'])
        {
            res.redirect('/login')
        }
        else
        {
            next()
        }
    }

async function start() {
    await app.prepare()

    const server = express();
    server.use(compression())
    server.use(cookieParser())
    // bodyParser is needed just for POST.
    server.use(
        '/graphql',
        bodyParser.json(),
        graphqlExpress(req => {
            // this is set the client side via the the implicit Spotify Auth flow
            const token = req.cookies['spotify-token']
            const schema = makeSchema(token)
            return { schema }
        }));

    server.get('*', (req, res) => {

        return handle(req, res)
    })

    server.listen(port, (err) => {
        if (err) throw err
        if (dev) console.log(`> Ready on http://localhost:${port}`)
    })
}
start()