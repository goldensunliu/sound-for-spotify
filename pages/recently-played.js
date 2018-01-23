import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import NextHead from 'next/head'

import Button from '../components/button'
import LoadingFullScreen from '../components/LoadingFullScreen'

import Session from '../components/session'
import GlobalStyles from '../global-styles'
import withData from '../with-apollo/withData'
import checkLogin from '../utils/checkLogin'
import NavMenu from '../components/NavMenu'
import splitIntoPlaySessions from '../utils/splitIntoPlaySessions'

const recentlyPlayed = gql`
{
    recentlyPlayed {
	    track {
	        id
            name
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
	    played_at
	}
}
`

class Index extends Component {
    state = { collapseAll: false }
    static async getInitialProps ({req, res, query}) {
        checkLogin({req, res})
        return {
            userAgent: req ? req.headers['user-agent'] : navigator.userAgent
        }
    }

    constructor (props) {
        super(props)
    }

    toggleExpand = () => {
        this.setState({ collapseAll: !this.state.collapseAll })
    }

    renderSessions () {
        const { data: { recentlyPlayed, loading }  } = this.props
        const { collapseAll } = this.state
        const sessions = splitIntoPlaySessions(recentlyPlayed).map(session => {
            return session
        })
        return (
            <div>
                <div>
                    <Button onClick={this.toggleExpand}>{ collapseAll ? 'Expand All' : 'Collapse All'}</Button>
                </div>
                {sessions.map((session, i) => <Session key={i} session={session} collapse={collapseAll}/>)}
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
                {this.props.data.recentlyPlayed ? this.renderSessions() : <LoadingFullScreen/>}
                <style jsx global>{GlobalStyles}</style>
            </div>
        )
    }
}

const graphqlOptions = {
  options: (props) => {
      const collapsed = props.collapseAll
      return {
          variables: {
              collapsed: collapsed
          }
      }
  },
}

export default withData(graphql(recentlyPlayed)(Index))