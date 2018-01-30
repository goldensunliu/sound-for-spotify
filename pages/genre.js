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
                    <div>The Sound</div>
                    <div>The Pulse</div>
                    <div>The Edge</div>
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
}`}</style>
            </Layout>
        )
    }
}

export default withSentry(Index)