const Playlist = `
  type Playlist {
    """
    if the owner allows other users to modify the playlist.
    """
    collaborative: Boolean
    description: String
    followerCount: Int
    """
 	A link to the Web API endpoint providing full details of the playlist.
 	"""
    href: String
    """
    The Spotify ID for the playlist.
    """
    id: String
    """
    Images for the playlist. The array may be empty or contain up to three images. The images are returned by size in descending order.
    """
    images: [Image]
    """
    The name of the playlist.
    """
    name: String
    """
    The user who owns the playlist
    """
    owner: User
    """
    The playlist’s public/private status
    """
    public: Boolean
    """
    The version identifier for the current playlist. Can be supplied in other requests to target a specific playlist version
    """
    snapshot_id: String
    """
    the playlist’s tracks wrapped in a paging object
    """
    tracks(limit: Int, offset: Int): Paging
    totalTracks: Int
    """
    The Spotify URI for this user.
    """
    uri: String
  }
`

export default Playlist
