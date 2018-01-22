const PlaylistTrack = `
    type PlaylistTrack {
        """
        The date and time the track was added. Note that some very old playlists may return null
        """
        added_at: String
        """
        The Spotify user who added the track. Note that some very old playlists may return null
        """
        added_by: User
        """
        Whether this track is a local file or not
        """
        is_local: Boolean
        track: Track
    }
`

export default PlaylistTrack