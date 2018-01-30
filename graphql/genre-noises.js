import cheerio from 'cheerio'
import { makeExecutableSchema } from 'graphql-tools';

async function getPlaylists(genre) {
    const res = await fetch(`http://everynoise.com/engenremap-${genre}.html`)
    if (res.status !== 200) return
    const text = await res.text()
    const $ = cheerio.load(text)
    const corelist = parseUserAndPlaylistId($('.title :nth-child(3n)').attr('href'))
    const pulse = parseUserAndPlaylistId($('.title :nth-child(4n)').attr('href'))
    const edge = parseUserAndPlaylistId($('.title :nth-child(5n)').attr('href'))
    return { corelist, pulse, edge }
}

function parseUserAndPlaylistId(url) {
    const chunks = url.split('/')
    const userId = chunks[4]
    const playlistId = chunks[6]
    return { userId, playlistId }
}

async function getGenreNoises(genre) {
    const id = genre.replace(/\W/g, '').toLowerCase()
    const result = await getPlaylists(id)
    if (!result) return null
    let {corelist, pulse, edge} = result
    return { id: genre, coreRef: corelist, pulseRef: pulse, edgeRef: edge }
}

const GenreNoises = `
type GenreNoises {
    id: String,
    coreRef: PlaylistPointer,
    pulseRef: PlaylistPointer,
    edgeRef: PlaylistPointer
}

type PlaylistPointer {
    userId: String,
    playlistId: String
}
`

const RootQuery = `
type RootQuery {
    genreNoises(genres: [String]!): [GenreNoises]
}
schema {
    query: RootQuery
}
`
const typeDefs = [GenreNoises, RootQuery]

export const linkTypeDefs = `
  extend type GenreNoises {
    corelist: Playlist,
    pulse: Playlist,
    edge: Playlist
  }
`;

export const genreSchema = makeExecutableSchema({
    typeDefs,
    resolvers: {
        RootQuery: {
            genreNoises: async (parent, {genres}, context, info) => {
                return genres.map(genre => getGenreNoises(genre))
            }
        }
    }
});

export const linkTypeDef2nd = `
  extend type GenreNoises {
    related: [GenreNoises]
  }
`

export const mergeResolvers2nd = mergeInfo =>({
    GenreNoises: {
        related: {
            // when https://github.com/apollographql/graphql-tools/issues/602 is resolved, explicity set the fields needs
            // right now it is assumeed client always query { corelist { description } } for this to wrok
            fragment: `fragment RelatedGenresFragment on GenreNoises { id }`,
            resolve: async (parent, args, context, info) => {
                if (!parent.corelist || !parent.corelist.description) return
                let { corelist: { description } } = parent
                const $ = cheerio.load(description)
                const relatedGenres = $('a').map((i, el) => $(el).text()).get().slice(2)
                return await mergeInfo.delegate(
                    'query',
                    'genreNoises',
                    { genres: relatedGenres },
                    context,
                    info,
                )
            }
        }
    }
})

export const mergeResolvers = mergeInfo => ({
    GenreNoises: {
        corelist: {
            fragment: `fragment CorePlaylistPointerFragment on GenreNoises { coreRef { userId, playlistId } }`,
            resolve : async (parent, args, context, info) => {
                let { coreRef : { userId, playlistId } } = parent
                return await mergeInfo.delegate(
                    'query',
                    'playlist',
                    { userId, playlistId },
                    context,
                    info,
                )
            }
        },
        pulse: {
            fragment: `fragment PulsePlaylistPointerFragment on GenreNoises { id pulseRef { userId, playlistId } }`,
            resolve : async (parent, args, context, info) => {
                let { pulseRef : { userId, playlistId } } = parent
                return await mergeInfo.delegate(
                    'query',
                    'playlist',
                    { userId, playlistId },
                    context,
                    info,
                )
            }
        },
        edge: {
            fragment: `fragment EdgePlaylistPointerFragment on GenreNoises { id edgeRef { userId, playlistId } }`,
            resolve : async (parent, args, context, info) => {
                let { edgeRef : { userId, playlistId } } = parent
                return await mergeInfo.delegate(
                    'query',
                    'playlist',
                    { userId, playlistId },
                    context,
                    info,
                )
            }
        }
    }
})