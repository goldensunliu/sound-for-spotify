import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import LoadingFullScreen from '../components/LoadingFullScreen'
import Layout from '../components/Layout'
import LinkableSummary from '../components/LinkableSummary'

import withData from '../with-apollo/withData'
import checkLogin from '../utils/checkLogin'
import withSentry from '../raven'

const Summary = (props) => {
    const { totalTracks, id, images, owner : { id : ownerId }, external_urls : { spotify }} = props
    const image = images && images[0]
    return <LinkableSummary name={`${totalTracks} ${totalTracks > 1 ? 'Songs' : 'Song'}`} spotifyLink={spotify}
                            image={image} href={`/playlist?id=${id}&ownerId=${ownerId}`}/>
}

const featuredPlaylists = gql`
{
  featuredPlaylists(limit: 50) {
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
            <Layout name="Browse Featured Playlists" header="Featured Playlists">
                {this.props.data.featuredPlaylists ? this.renderSessions() : <LoadingFullScreen/>}
            </Layout>
        )
    }
}

export default withSentry(withData(graphql(featuredPlaylists)(Index)))