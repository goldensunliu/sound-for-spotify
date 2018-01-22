const Track = `
    type Track {
        album: Album
        artists: [Artist]
        audio_features: AudioFeatures
        available_markets: [String]
        duration_ms: Int
        explicit: Boolean
        href: String
        id: String
        is_playable: Boolean
        name: String
        popularity: Int
        preview_url: String
        track_number: Int
        uri: String 
    }
`

export default Track