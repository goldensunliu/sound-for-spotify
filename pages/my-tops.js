import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory'

import LoadingFullScreen from '../components/LoadingFullScreen'
import {Collapse} from 'react-collapse'
import AudioFeatureIcon from '../components/AudioFeatureIcon'
import Playlist from '../components/Playlist'

import withData from '../with-apollo/withData'
import withSentry from '../raven'
import checkLogin from '../utils/checkLogin'
import round from '../utils/round'
import Layout from '../components/Layout'
import { backGroundOrange } from "../utils/colors";

function BarChartWrapper({ data, attributeKey}) {
    let x = (d) => (d[0] * 10)
    let xDomain = [0, 10];
    if (attributeKey === 'tempo') {
        xDomain = false;
        x = (d) => (d[0])
    }
    return (
        <VictoryChart
            animate
            height={200}
            padding={50}
            style={{
                parent: { backgroundColor: "white"}
            }}
        >
            <VictoryBar data={data} x={x} y={1} labels={(d) => d.y}
                        style={{ data: { fill: backGroundOrange } }} cornerRadius={5}/>
            <VictoryAxis crossAxis={false} domain={{x : xDomain}}/>

        </VictoryChart>
    )
}

function processFeatures(tracksFeatures) {
    const attributeStorage = {};
    tracksFeatures.forEach((features) => {
        processAttribute('valence', 1, features['valence'], attributeStorage);
        processAttribute('tempo', -1, features['tempo'], attributeStorage);
        processAttribute('energy', 1, features['energy'], attributeStorage);
        processAttribute('danceability', 1, features['danceability'], attributeStorage);
        processAttribute('instrumentalness', 1, features['instrumentalness'], attributeStorage);
        processAttribute('liveness', 1, features['liveness'], attributeStorage);
        processAttribute('loudness', 1, features['loudness'], attributeStorage);
        processAttribute('speechiness', 1, features['speechiness'], attributeStorage);
        processAttribute('acousticness', 1, features['acousticness'], attributeStorage);
        processAttribute('key', 1, features['key'], attributeStorage);
    })
    return attributeStorage
}

function processAttribute(key, rounding, attributeValue, attributeStorage) {
    const distributionIndex = round(attributeValue, rounding);
    let distributionMap, sum, count;
    if (!attributeStorage[key]) {
        distributionMap = {};
        sum = attributeValue;
        count = 1;
    } else {
        distributionMap = attributeStorage[key].distributionMap;
        sum = attributeStorage[key].sum + attributeValue;
        count = attributeStorage[key].count + 1;
    }
    distributionMap[distributionIndex] = distributionMap[distributionIndex] ? distributionMap[distributionIndex] + 1: 1
    attributeStorage[key] = { distributionMap, sum, count };
}

function getGenreCount(artists) {
    const genreCount = {};
    artists.forEach(({ genres }) => {
        genres.forEach(genre => {
            genreCount[genre] = (genreCount[genre] || 0) + 1
        })
    })
    const sorted = Object.entries(genreCount).map(([genre, count]) => ({genre, count}))
    sorted.sort((a, b) => (b.count - a.count))
    return sorted
}

function getAudioFeatures(tracksFeatures) {

}

const topTypesQuery = gql`
query ($timeRange: TimeRange = medium_term) {
  topTracks: top(type: tracks, limit: 100, time_range: $timeRange) {
    items {
      ... on Track {
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
    limit
    total
  }
  topArtists: top(type: artists, limit: 100, time_range: $timeRange) {
    items {
      ... on Artist {
        name
        genres
        popularity
        followerCount
      }
    }
    limit
    total
  }
}
`

const Genre = ({ genre, count, total }) => {
    return (
        <div className="root">
            <div className="genre">{genre}</div>
            {/*language=CSS*/}
            <style jsx>{`
                .root {
                    background-color: ${backGroundOrange};
                    color: white;
                    font-weight: bold;
                    font-size: 1.2em;
                    border-radius: 4px;
                    width: 80%;
                    height: 2em;
                    margin: 2px;
                    text-transform: capitalize;
                    padding: 5px;
                    display: flex;
                    align-items: center;
                    text-align: center;
                    display: flex;
                    justify-content: space-between;
                }
                .genre {
                    font-size: 1.5em;
                    white-space: nowrap;
                }
            `}</style>
        </div>
    )
}

const AttributeRow = ({ sum, count, attributeKey }) => {
    let copy;
    if (attributeKey !== 'tempo') {
        copy = `Avg ${attributeKey}: ${round(sum / count * 10, 0)}/10`
    }
    else
    {
        copy = `Avg ${attributeKey}: ${round(sum / count, 0)}`
    }
    return (
        <div className="root">
            <AudioFeatureIcon attributeKey={attributeKey}>
                <div className="attribute-copy">{copy}</div>
            </AudioFeatureIcon>
            {/*language=CSS*/}
            <style jsx>{`
                .root {
                    display: flex;
                    align-items: center;
                    margin: .5em;
                    color: white;
                }
                .root :global(.attribute) {
                    flex-direction: row;
                    padding-left: .5em;
                    paddign-right: .5em;
                }
                .root :global(.attribute svg) {
                    fill: white;
                }
                .attribute-copy {
                    font-size: 1.5em;
                    margin-left: .3em;
                    font-weight: 500;
                    text-transform: capitalize;
                }
            `}
            </style>
        </div>
    )
}

const AttributeSection = ({attributeKey, stats}) => {
    const { sum, count, distributionMap } = stats
    return (
        <div className="root">
            <AttributeRow {...{ sum, count, attributeKey }}/>
            <BarChartWrapper data={Object.entries(distributionMap)} attributeKey={attributeKey}/>
            {/*language=CSS*/}
            <style jsx>{`
                .root {
                    border: .5em;
                    overflow: hidden;
                    background-color: ${backGroundOrange};
                    border-radius: .4em;
                    padding-bottom: .5em;
                    border-left: 1px solid ${backGroundOrange};
                    border-right: 1px solid ${backGroundOrange};
                    margin-bottom: .6em;
                }
            `}
            </style>
        </div>
    )
}

class Index extends Component {
    state = {}
    static async getInitialProps ({req, res}) {
        checkLogin({req, res})
    }

    constructor (props) {
        super(props)
    }

    renderTopGenres() {
        const { genreCount, data: { topArtists : { items } } } = this.props
        return (
            <div className="root">
                <div className="header">Your Top Artists Genres</div>
                <div className="genres">
                    {
                        genreCount.slice(0, 12).map(
                            ({ genre, count }, i) => (<Genre key={i} genre={genre} count={count} total={items.length}/>)
                        )
                    }
                </div>
                {/*language=CSS*/}
                <style jsx>{`
                    .root {
                        width: 100%;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 1em;
                    }
                    .genres {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                `}
                </style>
            </div>
        )
    }

    renderTopTrackStats() {
        const { trackStats, data: { topTracks: { items: topTracks }}} = this.props
        return (
            <div className="root">
                <div className="header">Audio Insights On Top Tracks</div>
                <AttributeSection attributeKey="energy" stats={trackStats.energy}/>
                <AttributeSection attributeKey="danceability" stats={trackStats.danceability}/>
                <AttributeSection attributeKey="tempo" stats={trackStats.tempo}/>
                <AttributeSection attributeKey="valence" stats={trackStats.valence}/>
                <AttributeSection attributeKey="acousticness" stats={trackStats.acousticness}/>
                <AttributeSection attributeKey="liveness" stats={trackStats.liveness}/>
                <AttributeSection attributeKey="speechiness" stats={trackStats.speechiness}/>
                {/*language=CSS*/}
                <style jsx>{`
                    .root {
                        width: 100%;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 1em;
                        margin-top: 1em;
                    }
                    .genres {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                `}
                </style>
            </div>
        )
    }

    renderTops () {
        const { data: { topTracks: { items: topTracks }}} = this.props
        return (
            <div>
                {this.renderTopTrackStats()}
                <Playlist tracks={topTracks} name="Top Tracks For You" isCollapsed={true} collapsable={true}/>
                {this.renderTopGenres()}
                {/*language=CSS*/}
                <style jsx>{`
                    div {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        width: 100%;
                        max-width: 600px;
                        margin: auto;
                    }
                `}</style>
            </div>)
    }

    render() {
        return (
            <Layout name="Insights Of Your Preferences">
                {this.props.data.topArtists ? this.renderTops() : <LoadingFullScreen/>}
            </Layout>
        )
    }
}

const graphqlOptions = {
    props: (props) => {
        let genreCount, trackStats
        const { data : { loading, topArtists, topTracks, fetchMore } } = props
        // TODO add call to query by different ranges
        if (!loading && topArtists) {
            genreCount = getGenreCount(topArtists.items)
            trackStats = processFeatures(topTracks.items.map(({audio_features}) => (audio_features)))
        }
        return { genreCount, trackStats, ...props }
    }
}

export default withSentry(withData(graphql(topTypesQuery, graphqlOptions)(Index)))