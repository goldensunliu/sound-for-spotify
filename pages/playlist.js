import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import NextHead from 'next/head'

import Playlist from '../components/playlist'

import LoadingFullScreen from '../components/LoadingFullScreen'

import GlobalStyles from '../global-styles'
import withData from '../with-apollo/withData'
import checkLogin from '../utils/checkLogin'
import NavMenu from '../components/NavMenu'

const playlistQuery = gql`
query playlist($userId: String!, $playlistId: String!) {
  playlist(userId: $userId, playlistId: $playlistId) {
    name
    totalTracks
    tracks {
      items {
        ... on PlaylistTrack {
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
        }
      }
    }
  }
}

`

class Index extends Component {
    static async getInitialProps ({req, res, query: { id, ownerId }}) {
        checkLogin({req, res})
        return {
            userAgent: req ? req.headers['user-agent'] : navigator.userAgent ,
            id, ownerId
        }
    }

    constructor (props) {
        super(props)
    }

    renderPlaylist () {
        const { data: { playlist, loading }  } = this.props
        return (
            <div>
                <Playlist {...playlist} />
                { /*language=CSS*/ }
                <style jsx>{`
                    div {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding: .5em;
                    }
                `}</style>
            </div>)
    }

    render() {
        return (
            <div>
                <NextHead>
                    <title>View Spotify Featured Playlists</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" type="text/css"/>
                </NextHead>
                <NavMenu/>
                {this.props.data.playlist ? this.renderPlaylist() : <LoadingFullScreen/>}
                <style jsx global>{GlobalStyles}</style>
            </div>
        )
    }
}

const graphqlOptions = {
  options: (props) => {
      const { id, ownerId } = props
      return {
          variables: {
              userId: ownerId,
              playlistId: id
          }
      }
  },
}

export default withData(graphql(playlistQuery, graphqlOptions)(Index))