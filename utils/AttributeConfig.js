export const AttributeConfig = {
    valence: {
        label: "Valence",
        explanation: 'The musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).',
        //Icon: Positivity
    },
    popularity: {
        label: 'Popularity',
        explanation: 'The popularity of the track. The value will be between 0 and 100, with 100 being the most popular. The popularity is calculated by algorithm and is based, in the most part, on the total number of plays the track has had and how recent those plays are.'
    },
    tempo: {
        label: "Tempo",
        explanation: 'The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.',
        //Icon: Metronome
    },
    energy: {
        label: "Energy",
        explanation: 'Energy represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.',
        //Icon: Battery
    },
    danceability: {
        label: "Danceability",
        explanation: 'Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity.',
        //Icon: DiscoBall
    },
    instrumentalness: {
        label: "Instrumentalness",
        explanation: 'Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly "vocal". The closer the instrumentalness value is to 10, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 10.'
    },
    liveness : {
        label: "Liveness",
        explanation: 'Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live.',
        //Icon: Hand
    },
    loudness: {
        label: "Loudness",
        explanation: 'The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typical range between -60 and 0 db.'
    },
    speechiness: {
        label: "Speechiness",
        explanation: 'Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 10 the attribute value. Values above 6.6 describe tracks that are probably made entirely of spoken words. Values between 3.3 and 6.6 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 3.3 most likely represent music and other non-speech-like tracks.',
        //Icon: Chat
    },
    acousticness: {
        label: "Acousticness",
        explanation: 'A confidence measure from 0 to 10 of whether the track is acoustic. 10 represents high confidence the track is acoustic.',
        //Icon: Guitar
    },
    key: {
        label: "Key",
        explanation: "The key the track is in."
    }
}