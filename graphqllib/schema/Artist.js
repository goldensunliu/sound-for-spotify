const Artist = `
    type Artist {
        followerCount: Int
        uri: String
        href: String
        id: String
        images: [Image]
        name: String
        popularity: Int
        genres: [String]
    }
`;

export default Artist