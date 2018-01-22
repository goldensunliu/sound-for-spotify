const AudioFeatures = `
    type AudioFeatures {
        acousticness: Float
        danceability: Float
        duration_ms: Int
        energy: Float
        instrumentalness: Float
        key: Int
        liveness: Float
        loudness: Float
        mode: Int
        speechiness: Float
        tempo: Float
        time_signature: Int
        valence: Float
        id: String
        uri: String
    }
`

export default AudioFeatures