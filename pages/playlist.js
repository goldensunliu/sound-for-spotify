import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Playlist from '../components/Playlist'

import LoadingFullScreen from '../components/LoadingFullScreen'

import withData from '../with-apollo/withData'
import checkLogin from '../utils/checkLogin'
import Layout from '../components/Layout'

const playlistQuery = gql`
query playlist($userId: String!, $playlistId: String!) {
  playlist(userId: $userId, playlistId: $playlistId) {
    name
    totalTracks
    images {
        url
        width
        height
    }
    tracks {
      items {
        ... on PlaylistTrack {
          track {
	        id
            name
            external_urls {
              spotify
            }
            duration_ms
            artists {
                name
                id
            }
            album {
                name
                images {
                    url
                    width
                    height
                }
            }
          }
        }
      }
      limit
      offset
      total
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
        const { data: { playlist }  } = this.props
        return (
            <div>
                <Playlist tracks={playlist.tracks.items.map(({track}) => track)} name={playlist.name} totalTracks={playlist.totalTracks} />
                { /*language=CSS*/ }
                <style jsx>{`
                    div {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        width: 100%;
                    }
                `}</style>
            </div>)
    }

    render() {
        return (
            <Layout name="Playlist Details">
                {this.props.data.playlist ? this.renderPlaylist() : <LoadingFullScreen/>}
            </Layout>
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
    props: (props) => {

        return props
    }
}

export default withData(graphql(playlistQuery, graphqlOptions)(Index))