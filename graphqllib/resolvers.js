import {
    getFeaturedPlaylists, getRecentlyPlayed, makePlaylistLoader, makePlaylistTracksLoader, makeAlbumsLoader,
    makeUserLoader, makeArtistsLoader, makeAudioFeaturesLoader
} from './SpotifyWebApi'

export function makeResolvers(token) {
    const PlaylistLoader = makePlaylistLoader(token)
    const PlaylistTracksLoader = makePlaylistTracksLoader(token)
    const AlbumLoader = makeAlbumsLoader(token)
    const UserLoader = makeUserLoader(token)
    const ArtistLoader = makeArtistsLoader(token)
    const AudioFeatureLoader = makeAudioFeaturesLoader(token)

    const resolvers = {
        RootQuery: {
            featuredPlaylists: async (obj, args) => {
                const res = await getFeaturedPlaylists(token, args)
                return res.playlists
            },
            recentlyPlayed: async () => {
                const { items } = await getRecentlyPlayed(token)
                return items
            },
            playlist: async(obj, {playlistId, userId}) => {
                const playlistFull = await PlaylistLoader.load({ playlistId, userId })
                return playlistFull
            },
            artist: async(obj, {artistId}) => {
                const artist = await ArtistLoader.load(artistId)
                return artist
            }
        },
        Playlist: {
            description: async (object) => {
                const {id: playlistId , owner: { id: userId }} = object
                const playlistFull = await PlaylistLoader.load({ playlistId, userId })
                return playlistFull.description
            },
            totalTracks: async ({ tracks: { total }}) => {
                return total
            },
            tracks: async (obj, args) => {
                const {id: playlistId , owner: { id: userId }} = obj
                return await PlaylistTracksLoader.load({playlistId, userId, ...args })
            }
        },
        Track: {
            audio_features: async ({ id }) => {
                const features = await AudioFeatureLoader.load(id)
                return features
            }
        },
        User: {
            followerCount: async ({ id }) => {
                const userFull = await UserLoader.load(id)
                return userFull.followers.total
            }
        },
        Artist: {
            followerCount: async ({ id }) => {
                const artistFull = await ArtistLoader.load(id)
                return artistFull.followers.total
            },
            images: async ({ id }) => {
                const artistFull = await ArtistLoader.load(id)
                return artistFull.images
            },
            popularity: async ({ id }) => {
                const artistFull = await ArtistLoader.load(id)
                return artistFull.popularity
            },
            genres: async ({ id }) => {
                const artistFull = await ArtistLoader.load(id)
                return artistFull.genres
            },

        },
        Album: {
            genres: async (object) => {
                const AlbumFull = await AlbumLoader.load(object.id)
                return AlbumFull.genres
            },
            label: async (object) => {
                const AlbumFull = await AlbumLoader.load(object.id)
                return AlbumFull.label
            },
            popularity: async (object) => {
                const AlbumFull = await AlbumLoader.load(object.id)
                return AlbumFull.popularity
            },
            release_date: async (object) => {
                const { release_date } = await AlbumLoader.load(object.id)
                return release_date
            },
            release_date_precision: async (object) => {
                const { release_date_precision } = await AlbumLoader.load(object.id)
                return release_date_precision
            }
        },
        Item: {
            __resolveType(object, context, info){
                const { type } = object
                if (type == 'user') {
                    return 'User'
                }
                if (type == 'playlist') {
                    return 'Playlist'
                }
                if (object.added_at) {
                    return 'PlaylistTrack'
                }
            }
        }
    };
    return resolvers
}