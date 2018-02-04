import express from 'express';
import helmet from 'helmet'
import bodyParser from 'body-parser';
import { graphqlExpress } from 'apollo-server-express';
import compression from 'compression'
import next from 'next'
import cookieParser from 'cookie-parser'
import { makeSchema } from "graphql-spotify";
import { APOLLO_ENGINE_API_KEY } from './spotify-config'
import { Engine } from 'apollo-engine'
import { mergeSchemas } from 'graphql-tools';
import { genreSchema, linkTypeDefs, linkTypeDef2nd, mergeResolvers, mergeResolvers2nd } from './graphql/genre-noises'


const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = parseInt(process.env.PORT, 10) || 3000

function middlewareRedirectToHTTPS (req, res, next) {
    const isNotSecure = (!req.get('x-forwarded-port') && req.protocol !== 'https') ||
        parseInt(req.get('x-forwarded-port'), 10) !== 443

    if (isNotSecure) {
        return res.redirect('https://' + req.get('host') + req.url)
    }

    next()
}

function attachEngine(server) {
    const engine = new Engine({
        engineConfig: {
            apiKey: APOLLO_ENGINE_API_KEY
        },
        graphqlPort: port
    });

    engine.start();
    server.use(engine.expressMiddleware())
}


async function start() {
    await app.prepare()

    const server = express();
    if (!dev) {
        server.use(helmet({
            hsts : {
                maxAge: 31536000,
                includeSubDomains: true,
                preload: true
            }
        }))
        server.use(middlewareRedirectToHTTPS)
    }
    server.use(compression())
    server.use(cookieParser())
    if (APOLLO_ENGINE_API_KEY) {
        attachEngine(server)
    }
    // bodyParser is needed just for POST.
    server.use(
        '/graphql',
        bodyParser.json(),
        graphqlExpress(req => {
            // this is set the client side via the the implicit Spotify Auth flow
            const token = req.query['token']
            const schema = makeSchema(token)
            let mergedSchema =  mergeSchemas({
                schemas: [schema, genreSchema, linkTypeDefs],
                resolvers: mergeResolvers
            })
            mergedSchema = mergeSchemas({
                schemas: [mergedSchema, linkTypeDef2nd],
                resolvers: mergeResolvers2nd
            })
            // the whole execution takes about 20ms
            return {
                schema: mergedSchema,
                tracing: true,
                cacheControl: true
            }
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
