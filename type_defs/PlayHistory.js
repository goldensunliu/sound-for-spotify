const PlayHistory = `
    type PlayHistory {
        """
        The track the user listened to.
        """
        track: Track
        """
        The date and time the track was played.
        """	
        played_at: String
        # TODO add context object
    }
`;

export default PlayHistory