// TODO make album_type, release_date_precision enum
const Album = `
    type Album {
        album_type: String
        artists: [Artist]
        available_markets: [String]
        # genres are always empty from spotify
        genres: [String]
        href: String
        id: String
        images: [Image]
        label: String
        name: String
        popularity: Int
        release_date: String
        release_date_precision: String
        tracks: [Track]
        totalTracks: Int
        uri: String
    }
`

export default Album