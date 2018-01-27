import React, {Component} from 'react'
import Link from 'next/link'

import Layout from '../components/Layout'
import { backGroundOrange } from "../utils/colors";
import withSentry from '../raven'

class Index extends Component {
    constructor (props) {
        super(props)
    }

    render() {
        return (
            <Layout name="Playlist Details">
                <div className="root">
                    <div className="menu-item"><Link href="/graphiql"><a>Spotify GraphQL Explorer</a></Link></div>
                    <div className="menu-item"><Link href="/recently-played"><a>Play History Insights</a></Link></div>
                    <div className="menu-item"><Link href="/my-tops"><a>Insights On Your Top Preferences</a></Link></div>
                    <div className="menu-item"><Link href="/featured-playlists"><a>Browse Featured Playlists</a></Link></div>
                    <div className="menu-item"><Link href="/categories"><a>Browse Categories</a></Link></div>
                </div>
                { /*language=CSS*/ }
                <style jsx>{`
.root {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 600px;
    margin: auto;
}
                    .menu-item {
                        cursor: pointer;
                        width: 20em;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
                        border-top: .5em solid ${backGroundOrange};
                        border-bottom: .5em solid ${backGroundOrange};
                        border-radius: 6px;
                        margin: 1em;
                        overflow: hidden;
                        color: ${backGroundOrange};
                        font-weight: 500;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                    }
                    .menu-item :global(a) {
                        font-size: 1.5em;
                        padding: .5em;
                    }
                `}</style>
            </Layout>
        )
    }
}

export default withSentry(Index)