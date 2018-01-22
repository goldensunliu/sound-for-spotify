import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import NextHead from 'next/head'
import Link from 'next/link'

import LoadingFullScreen from '../components/LoadingFullScreen'
import { backGroundOrange } from '../utils/colors'

import GlobalStyles from '../global-styles'
import withData from '../with-apollo/withData'
import checkLogin from '../utils/checkLogin'
import NavMenu from '../components/NavMenu'

const Summary = ({name, totalTracks, id, owner : { display_name, id : ownerId }}) => {
    return (
        <Link href={`/Playlist?id=${id}&ownerId=${ownerId}`}>
            <a className="root">
                <div className="top">
                    <div>{`${name} (${totalTracks} ${totalTracks > 1 ? 'Songs' : 'Song'})`}</div>
                    <div>{`By ${display_name}`}</div>
                </div>
                { /*language=CSS*/ }
                <style jsx>{`
                    .root {
                        width: 100%;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
                        border-bottom: .5em solid ${backGroundOrange};
                        border-radius: 6px;
                        max-width: 600px;
                        margin-bottom: 15px;
                        overflow: hidden;
                    }
                    .top {
                        color: white;
                        font-weight: bold;
                        display: flex;
                        justify-content: space-between;
                        padding: .5em;
                        background-color: ${backGroundOrange};
                        text-transform: capitalize;
                        font-size: 1.2em;
                    }
                `}</style>
            </a>
        </Link>
    )
}

const featuredPlaylists = gql`
{
  featuredPlaylists {
    items {
      ... on Playlist {
        id
        owner {
          id
          display_name
        }
        name
        totalTracks
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
                {this.props.data.featuredPlaylists ? this.renderSessions() : <LoadingFullScreen/>}
                <style jsx global>{GlobalStyles}</style>
            </div>
        )
    }
}

export default withData(graphql(featuredPlaylists)(Index))