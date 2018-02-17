import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory'
import { Collapse } from 'react-collapse'
import css from 'styled-jsx/css'

import LoadingFullScreen from '../components/LoadingFullScreen'
import withData from '../with-apollo/withData'
import withSentry from '../raven'
import checkLogin from '../utils/checkLogin'
import Layout from '../components/Layout'
import GenresRow from '../components/GenresRow'
import Artist from '../components/Artist'
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
  topArtists: top(type: artists, limit: 100, time_range: $timeRange) {
    items {
      ... on Artist {
        id
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

{/*language=CSS*/}
const CardStyle = css`
.card {
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
`

class TopGenres extends Component {
    state = { showAll: false }

    toggle = () => {
        this.setState({ showAll: !this.state.showAll })
    }

    render() {
        const { genreCount } = this.props
        return (
            <div className="card">
                <div className="header">Your Top Artists Genres</div>
                <div className="genres">
                    <GenresRow genres={genreCount.slice(0,
                        !this.state.showAll ? 20 : genreCount.length).map(({ genre, count }) => genre)}/>
                </div>
                <div className="bottom-toggle" onClick={this.toggle}>
                    {!this.state.showAll ? "show all" : "show less"}
                </div>
                <style jsx>{CardStyle}</style>
                {/*language=CSS*/}
                <style jsx>{`
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

class TopArtists extends Component {
    render() {
        const { artists } = this.props
        return (
            <div className="card">
                <div className="header">Your Top Artists</div>
                <div className="tip">click an artist to discover related genres</div>
                <div className="artists">
                {
                    artists.map(artist => (
                        <Artist id={artist.id}/>
                    ))
                }
                </div>
                <style jsx>{CardStyle}</style>
                {/*language=CSS*/}
                <style jsx>{`
                    .header {
                        text-align: center;
                        color: white;
                    }
                    .tip {
                        text-align: center;
                        background-color: white;
                    }
                    .artists {
                        display: flex;
                        padding: .4em;
                        justify-content: center;
                        align-items: center;
                        flex-wrap: wrap;
                        background-color: white;
                    }
                    .artists :global(.artist) {
                        font-size: 1.5em;
                        margin: .25em;
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

    renderTops () {
        const { data: { topArtists: { items: topArtists } }, genreCount} = this.props
        return (
            <div className="root">
                <TopArtists artists={topArtists}/>
                <TopGenres genreCount={genreCount}/>
                {/*language=CSS*/}
                <style jsx>{`
                    .root {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        width: 100%;
                        max-width: 800px;
                        margin: auto;
                        margin-top: 1.5em;
                    }
                `}</style>
            </div>)
    }

    render() {
        return (
            <Layout name="Discover Your Top Artists" header="Your Top Preferences">
                {this.props.data.topArtists ? this.renderTops() : <LoadingFullScreen/>}
            </Layout>
        )
    }
}

const graphqlOptions = {
    props: (props) => {
        let genreCount, trackStats
        const { data : { loading, topArtists, fetchMore } } = props
        // TODO add call to query by different ranges
        if (!loading && topArtists) {
            genreCount = getGenreCount(topArtists.items)
        }
        return { genreCount, ...props }
    }
}

export default withSentry(withData(graphql(topTypesQuery, graphqlOptions)(Index)))