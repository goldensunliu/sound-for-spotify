import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import compression from 'compression'
import next from 'next'
import cookieParser from 'cookie-parser'

// TODO pull from index.js
import Playlist from './type_defs/Playlist'
import Image from './type_defs/Image'
import User from './type_defs/User'
import PlaylistTrack from './type_defs/PlaylistTrack'
import Track from './type_defs/Track'
import Album from './type_defs/Album'
import Artist from './type_defs/Artist'
import Paging from './type_defs/Paging'
import AudioFeatures from './type_defs/AudioFeatures'
import PlayHistory from './type_defs/PlayHistory'

import { makeResolvers } from './graphqllib/resolvers'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = parseInt(process.env.PORT, 10) || 3000

const SchemaDefinition = `
  schema {
    query: RootQuery
  }
`;

const RootQuery = `
  type RootQuery {
    featuredPlaylists(limit: Int, offset: Int): Paging
    """
    Returns the most recent 50 tracks played by a user
    """
    recentlyPlayed: [PlayHistory]
  }
`;

const typeDefs = [SchemaDefinition, RootQuery, Playlist, Image, User, PlaylistTrack, Track, Album, Artist, Paging,
    AudioFeatures, PlayHistory];

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
            const schema = makeExecutableSchema({
                typeDefs,
                // initialize resolvers using new data loaders on each request
                resolvers: makeResolvers(token),
            });
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
