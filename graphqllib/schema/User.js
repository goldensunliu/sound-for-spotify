const User = `
  type User {
    """
    The name displayed on the user’s profile.
    """
    display_name: String
    """
    Information about the followers of this user.
    """
    followerCount: Int
    """
    A link to the Web API endpoint for this user.
    """
    href: String
    """
    The Spotify user ID for this user.
    """
    id: String
    """
    The user’s profile image.
    """
    images: [Image]
    """
    The Spotify URI for this user.
    """
    uri: String
  }
`

export default User