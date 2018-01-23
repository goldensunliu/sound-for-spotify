import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Link from 'next/link'

import LoadingFullScreen from '../components/LoadingFullScreen'
import ImageWithLoader from '../components/ImageWithLoader'
import Layout from '../components/Layout'
import { backGroundOrange } from '../utils/colors'

import withData from '../with-apollo/withData'
import checkLogin from '../utils/checkLogin'

const Summary = (props) => {
    const { totalTracks, id, images, owner : { id : ownerId }, external_urls : { spotify }} = props
    const image = images && images[0]
    return (
        <div className="root">
            <div className="top">
                <div>{`${totalTracks} ${totalTracks > 1 ? 'Songs' : 'Song'}`}</div>
                <a href={spotify} target="_blank"><img src="/static/Spotify_White.png"/></a>
            </div>
            {image &&
            <Link href={`/playlist?id=${id}&ownerId=${ownerId}`}>
                <a><ImageWithLoader url={image.url} style={{ width: '10em', height: '10em', overflow: 'hidden' }}/></a>
            </Link>
            }
            { /*language=CSS*/ }
            <style jsx>{`
                    .root {
                        width: 10em;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
                        border-bottom: .5em solid ${backGroundOrange};
                        border-radius: 6px;
                        margin: 1em;
                        overflow: hidden;
                    }
                    .top {
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        font-weight: bold;
                        padding: .25em .5em;
                        background-color: ${backGroundOrange};
                        text-transform: capitalize;
                        font-size: 1.2em;
                    }
                    img {
                        height: .75em;
                    }
                `}</style>
        </div>
    )
}

const featuredPlaylists = gql`
{
  featuredPlaylists {
    items {
      ... on Playlist {
        id
        images {
            url
            width
            height
        }
        owner {
          id
          display_name
        }
        name
        totalTracks
        external_urls {
            spotify
        }
      }
    }
    total
  }
}
`

class Index extends Component {
    state = { expanded: true }
    static async getInitialProps ({req, res, query}) {
        checkLogin({req, res})
    }

    constructor (props) {
        super(props)
    }


    renderSessions () {
        const { data: { featuredPlaylists, loading }  } = this.props
        return (
            <div>
                {featuredPlaylists.items.map((playlist, i) => <Summary key={i} {...playlist} />)}
                { /*language=CSS*/ }
                <style jsx>{`
                    div {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                        align-items: center;
                        padding: .5em;
                        flex: 1;
                    }
                `}</style>
            </div>
        )
    }

    render() {
        return (
            <Layout name="Browse Featured Playlists">
                {this.props.data.featuredPlaylists ? this.renderSessions() : <LoadingFullScreen/>}
            </Layout>
        )
    }
}

export default withData(graphql(featuredPlaylists)(Index))