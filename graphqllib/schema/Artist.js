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
        external_urls: ExternalUrls
    }
`;

export default Artist