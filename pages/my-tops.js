import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory'
import { Collapse } from 'react-collapse'

import LoadingFullScreen from '../components/LoadingFullScreen'
import AudioFeatureIcon from '../components/AudioFeatureIcon'
import Playlist from '../components/Playlist'
import Expand from '../images/expand-more.svg'

import withData from '../with-apollo/withData'
import withSentry from '../raven'
import checkLogin from '../utils/checkLogin'
import round from '../utils/round'
import Layout from '../components/Layout'
import GenresRow from '../components/GenresRow'
import Button from '../components/button'
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
            height={250}
            padding={{ top: 60, bottom: 30, left: 20, right: 20 }}
            style={{
                parent: { backgroundColor: "white"}
            }}
        >
            <VictoryBar data={data} x={x} y={1} labels={(d) => d.y} alignment="start"
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

const AttributeRow = ({ sum, count, attributeKey, distributionMap, onClick, expanded }) => {
    const sortedKeys = Object.keys(distributionMap).sort()
    const min = sortedKeys[0]
    const max = sortedKeys[sortedKeys.length - 1]
    let copy;
    if (attributeKey !== 'tempo') {
        copy = `Min=${min*10}  Max=${max*10}  Avg=${round(sum / count * 10, 0)}/10`
    }
    else
    {
        copy = `Min=${min}  Max=${max}  Avg=${round(sum / count, 0)}`
    }
    return (
        <div className="root" onClick={onClick}>
            <div className="attribute-copy">
                <b>{attributeKey}</b>
                {copy}
            </div>
            <Expand style={{ width: '1.5em', height: '1.5em' }} className={`expand${expanded ? " expanded" : ""}`}/>
            {/*language=CSS*/}
            <style jsx>{`
                .root {
                    display: flex;
                    cursor: pointer;
                    align-items: center;
                    justify-content: space-between;
                    margin: .5em;
                    color: white;
                }
                .root :global(.expand) {
                    transform: rotate(90deg);
                    transition: all .25s;
                    fill: white;
                }
                .root :global(.expanded) {
                    transform: rotate(0deg);
                }

                .attribute-copy {
                    margin-left: .3em;
                    font-weight: 500;
                    text-transform: capitalize;
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-right: .2em;
                }
                .attribute-copy b {
                    font-size: 1.5em;
                    margin-right: .2em;
                }
            `}
            </style>
        </div>
    )
}
class AttributeSection extends Component {
    state = { expanded: true }

    toggle = () => {
        this.setState({ expanded: !this.state.expanded })
    }

    render() {
        const {attributeKey, stats} = this.props
        const { expanded } = this.state
        const { sum, count, distributionMap } = stats
        return (
            <div className={`root${expanded ? "" : " collapsed"}`}>
                <AttributeRow {...{ sum, count, distributionMap, attributeKey, expanded, onClick: this.toggle }}/>
                <Collapse isOpened={expanded}>
                    <div className="chart">
                        <AudioFeatureIcon attributeKey={attributeKey}/>
                        <BarChartWrapper data={Object.entries(distributionMap)} attributeKey={attributeKey}/>
                    </div>
                </Collapse>
                {/*language=CSS*/}
                <style jsx>{`
                    .root {
                        border: .5em;
                        overflow: hidden;
                        background-color: ${backGroundOrange};
                        border-radius: .4em;
                        border-left: 1px solid ${backGroundOrange};
                        border-right: 1px solid ${backGroundOrange};
                        margin-bottom: .6em;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
                    }
                    .root.collapsed {
                        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
                    }
                    .chart {
                        position: relative;
                        border-bottom: .4em solid ${backGroundOrange};
                    }
                    .chart :global(.with-popover) {
                        position: absolute;
                        z-index: 1;
                        left: .2em;
                        top: .2em;
                    }
                    .chart :global(.attribute) {
                        height: 50px;
                        width: 50px;
                        justify-content: center;
                        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
                        border-radius: 50%;
                    }
                    .chart :global(.attribute svg) {
                        fill: ${backGroundOrange};
                    }
                `}
                </style>
            </div>
        )
    }
}

class TopGenres extends Component {
    state = { showAll: false }

    toggle = () => {
        this.setState({ showAll: !this.state.showAll })
    }

    render() {
        const { genreCount } = this.props
        return (
            <div className="top-genres">
                <div className="header">Your Top Artists Genres</div>
                <div className="genres">
                    <GenresRow genres={genreCount.slice(0,
                        !this.state.showAll ? 20 : genreCount.length).map(({ genre, count }) => genre)}/>
                </div>
                <div className="bottom-toggle" onClick={this.toggle}>
                    {!this.state.showAll ? "show all" : "show less"}
                </div>
                {/*language=CSS*/}
                <style jsx>{`
                    .top-genres {
                        width: 100%;
                        border: .5em;
                        overflow: hidden;
                        box-sizing: border-box;
                        border-radius: .4em;
                        padding-bottom: .5em;
                        background-color: ${backGroundOrange};
                        border-left: 1px solid ${backGroundOrange};
                        border-right: 1px solid ${backGroundOrange};
                        margin-bottom: .6em;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
                    }
                    .header {
                        text-align: center;
                        color: white;
                    }
                    .genres {
                        display: flex;
                            padding: .4em;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        background-color: white;
                    }
                    .genres :global(.pill) {

                    }
                    .bottom-toggle {
                        cursor: pointer;
                        font-size: 1.2em;
                        margin-top: .2em;
                        font-weight: 500;
                        color: white;
                        text-align: center;
                    }
                `}
                </style>
            </div>
        )
    }
}

class Index extends Component {
    state = {}
    static async getInitialProps ({req, res}) {
        checkLogin({req, res})
    }

    constructor (props) {
        super(props)
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
        const { data: { topTracks: { items: topTracks }}, genreCount} = this.props
        return (
            <div className="root">
                <TopGenres genreCount={genreCount}/>
                {this.renderTopTrackStats()}
                <Playlist tracks={topTracks} name="Your Top Tracks" isCollapsed={true} collapsable={true}/>
                {/*language=CSS*/}
                <style jsx>{`
                    .root {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        width: 100%;
                        max-width: 600px;
                        margin: auto;
                        margin-top: 1.5em;
                    }
                `}</style>
            </div>)
    }

    render() {
        return (
            <Layout name="Discover Your Top Preferences" header="Your Top Preferences">
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