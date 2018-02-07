import React, { Component } from 'react';
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import Track from '../components/track'
import { backGroundOrange } from '../utils/colors'
import LoadingFullScreen from '../components/LoadingFullScreen'
import checkLogin from '../utils/checkLogin'
import withSentry from '../raven'
import withData from '../with-apollo/withData'
import Layout from '../components/Layout'
import Recommendations from '../components/Recommendations'

const trackQuery = gql`
query track($id: String!) {
  track(id: $id) {
    ...minimumFieldsForTrack
  }
  recommendations(parameters: {seed_tracks: [$id], limit: 5}) {
    tracks {
      ...minimumFieldsForTrack
    }
  }
}

fragment minimumFieldsForTrack on Track {
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
`

const graphqlOptions = {
    options: (props) => {
        const { id } = props
        return {
            variables: { id }
        }
    }
}

class Index extends Component {
    static async getInitialProps({req, res, query: {id}}) {
        checkLogin({req, res})
        return {
            userAgent: req ? req.headers['user-agent'] : navigator.userAgent,
            id
        }
    }

    renderTrackSection() {
        const { data: { track, recommendations : { tracks } } } = this.props
        return (
            <div className="root">
                <div className="track-wrapper">
                    <Track expanded track={track}/>
                </div>
                <Recommendations tracks={tracks} name="Recommendations" totalTracks={tracks.length}/>
                { /*language=CSS*/ }
                <style jsx>{`
                    .root {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        width: 100%;
                        max-width: 600px;
                        margin: auto;
                    }
                    .track-wrapper {
                        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
                        border-bottom: .5em solid ${backGroundOrange};
                        border-top: .5em solid ${backGroundOrange};
                        border-radius: 6px;
                        margin-bottom: 1em;
                        margin-top: 1em;
                        width: 100%;
                    }
                `}</style>
            </div>
        )
    }

    render() {
        const { data: { track } } = this.props
        return (
            <div>
                <Layout name={ track && track.name || "Track" } header={`Track Details`}>
                    {track ? this.renderTrackSection() : <LoadingFullScreen/>}
                </Layout>
            </div>
        )
    }
}

export default withSentry(withData(graphql(trackQuery, graphqlOptions)(Index)))