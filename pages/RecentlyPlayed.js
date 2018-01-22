import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import NextHead from 'next/head'

import Session from '../components/session'
import GlobalStyles from '../global-styles'
import withData from '../with-apollo/withData'
import checkLogin from '../utils/checkLogin'
import NavMenu from '../components/NavMenu'

// TODO test
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

const recentlyPlayed = gql`
{
    recentlyPlayed {
	    track {
	        id
            name
            duration_ms
            artists {
                name
                genres
                images {
                    url
                    width
                    height
                }
            }
            album {
                images {
                    url
                    width
                    height
                }
            }
            audio_features {
                acousticness
                danceability
                duration_ms
                energy
                instrumentalness
                key
                liveness
                loudness
                mode
                speechiness
                tempo
                time_signature
                valence
            }
	    }
	    played_at
	}
}
`

class Index extends Component {
    state = {}
    static async getInitialProps ({req, res, query}) {
        checkLogin({req, res})
        return { userAgent: req ? req.headers['user-agent'] : navigator.userAgent }
    }

    constructor (props) {
        super(props)
    }

    renderSessions () {
        const { data: { recentlyPlayed } } = this.props
        const sessions = splitIntoPlaySessions(recentlyPlayed).map(session => {
            return session
        })
        return (
            <div>
                {sessions.map((session, i) => <Session key={i} session={session}/>)}
                { /*language=CSS*/ }
                <style jsx>{`
                    div {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding: .5em;
                    }
                `}</style>
            </div>
        )
    }

    render() {
        return (
            <div>
                <NextHead>
                    <title>View Your Spotify Play History With Audio Feature Information</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" type="text/css"/>
                </NextHead>
                <NavMenu/>
                {this.props.data.recentlyPlayed ? this.renderSessions() : null}
                <style jsx global>{GlobalStyles}</style>
            </div>
        )
    }
}

export default withData(graphql(recentlyPlayed)(Index))