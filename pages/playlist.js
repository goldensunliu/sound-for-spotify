import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import Playlist from '../components/Playlist'

import LoadingFullScreen from '../components/LoadingFullScreen'
import Button from '../components/button'
import withSentry from '../raven'
import withData from '../with-apollo/withData'
import checkLogin from '../utils/checkLogin'
import Layout from '../components/Layout'
import ImageWithLoader from '../components/ImageWithLoader'

import { withFollowPlaylist, withUnfollowPlaylist } from '../components/graphqlHelpers'

const playlistQuery = gql`
query playlist($userId: String!, $playlistId: String!) {
  playlist(userId: $userId, playlistId: $playlistId) {
    id
    name
    totalTracks
    followerCount
    following
    images {
        url
        width
        height
    }
    owner {
        id
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

    followPlaylist = async () => {
        const { id: playlistId, owner: { id: ownerId } } = this.props.data.playlist
        this.props.followPlaylist({
            variables: { playlistId, ownerId }
        })
    }

    unfollowPlaylist = async () => {
        const { id: playlistId, owner: { id: ownerId } } = this.props.data.playlist
        this.props.unfollowPlaylist({
            variables: { playlistId, ownerId }
        })
    }

    renderTopSection() {
        const { data: { playlist: { images, name, followerCount } }  } = this.props
        const coverUrl = images && images.length && images[0].url
        return (
            <div className="root">
                <div className="playlist-name">{name}</div>
                <div className="main-section">
                    { coverUrl && <ImageWithLoader url={coverUrl} style={{ width: '10em', flexShrink: 0, height: '10em' }}/>}
                    <div className="playlist-info">
                        <div className="playlist-follower-count">Followers: {followerCount}</div>
                        {this.renderFollowToggle()}
                    </div>
                </div>
                { /*language=CSS*/ }
                <style jsx>{`
                    .root {
                        display: flex;
                        align-items: center;
                        flex-direction: column;
                        width: 100%;
                        padding: 1em;
                        box-sizing: border-box;
                    }
                    .main-section {
                        display: flex;
                        align-items: center;
                    }
                    .root :global(.btn) {
                        margin-top: .5em;
                    }
                    .root :global(.image-with-loader) {
                        margin-right: .5em;
                    }
                    .playlist-info {
                        flex: 1;
                    }
                    .playlist-name {
                        font-size: 1.8em;
                        font-weight: 500;
                        margin-bottom: .4em;
                    }
                    .playlist-follower-count {
                        margin-top: .5em;
                        font-weight: 500;
                    }
                `}</style>
            </div>
        )
    }

    renderPlaylist () {
        const { data: { playlist }  } = this.props
        const { images } = playlist
        const coverUrl = images && images.length && images[0].url
        return (
            <div>
                {this.renderTopSection()}
                <Playlist tracks={playlist.tracks.items.map(({track}) => track)} name={playlist.name}
                          totalTracks={playlist.totalTracks}/>
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

    renderFollowToggle = () => {
        const { data: { playlist: { following } }  } = this.props
        if (following) {
            return <Button color="blue" onClick={this.unfollowPlaylist} size="small">Unfollow</Button>
        } else {
            return <Button onClick={this.followPlaylist} size="small">Follow</Button>
        }
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

export default withSentry(withData(
    compose(
        graphql(playlistQuery, graphqlOptions),
        withUnfollowPlaylist,
        withFollowPlaylist
    )(Index)
))