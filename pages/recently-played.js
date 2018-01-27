import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Layout from '../components/Layout'
import Button from '../components/button'
import LoadingFullScreen from '../components/LoadingFullScreen'

import Session from '../components/session'
import withData from '../with-apollo/withData'
import withSentry from '../raven'
import checkLogin from '../utils/checkLogin'
import splitIntoPlaySessions from '../utils/splitIntoPlaySessions'

const recentlyPlayed = gql`
{
    recentlyPlayed {
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
         process.browser.heheheheh(1)
    }

    renderSessions () {
        const { data: { recentlyPlayed, loading }  } = this.props
        const { collapseAll } = this.state
        const sessions = splitIntoPlaySessions(recentlyPlayed).map(session => {
            return session
        })
        return (
            <div>
                <div className="collapse-toggle">
                    <Button onClick={this.toggleExpand}>{ collapseAll ? 'Expand All' : 'Collapse All'}</Button>
                </div>
                {sessions.map((session, i) => <Session key={i} session={session} collapse={collapseAll}/>)}
                { /*language=CSS*/ }
                <style jsx>{`
                    .collapse-toggle {
                        margin-top: .5em;
                        margin-bottom: .5em;
                    }
                    div {
                        display: flex;
                        width: 100%;
                        flex-direction: column;
                        align-items: center;
                    }
                `}</style>
            </div>
        )
    }

    render() {
        return (
            <Layout name="View Your Spotify Play History With Audio Feature Insights">
                {this.props.data.recentlyPlayed ? this.renderSessions() : <LoadingFullScreen/>}
            </Layout>
        )
    }
}

export default withSentry(withData(graphql(recentlyPlayed)(Index)))