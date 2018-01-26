const splitIntoPlaySessions = (history) => {
    let sessions = []
    let currentPlaySession;
    history.forEach((playedData, i) => {
        const { track, played_at } = playedData
        if (!currentPlaySession) {
            currentPlaySession = [playedData]
            return
        }
        const nextPlayedAt = history[i-1] && new Date(history[i-1].played_at)
        if (nextPlayedAt) {
            if ((new Date(played_at).getTime() + track.duration_ms + 400000) < nextPlayedAt.getTime()) {
                sessions.push(currentPlaySession)
                currentPlaySession = []
            }
        }
        currentPlaySession.push(playedData)
        if (i === history.length - 1) {
            sessions.push(currentPlaySession)
        }
    })
    return sessions
}

export default  splitIntoPlaySessions