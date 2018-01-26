import React, { Component } from 'react'
import Router from 'next/router'
import Cookies from 'js-cookie'

import Layout from '../components/Layout'
import { PendingState, getParamsFromHash } from '../components/LoginComponents'

function tryGettingTokenFromImplicit() {
    let tokenGotTime, token;
    if (window.location.hash) {
        tokenGotTime = new Date().getTime();
        const params = getParamsFromHash();
        token = params.access_token;
        const state = params.state
        // remove hash
        history.replaceState("", document.title, window.location.pathname
            + window.location.search);
        Cookies.set("spotify-token", token, { domain: null, expires: new Date((tokenGotTime + 3600000 - 1000))})
        // Use at your own risk, strongly recommend the following:
        Router.replace(decodeURIComponent(state))
    }
}

export default class Index extends Component {
    state = {}
    static async getInitialProps ({req, query}) {
        return {}
    }
    componentDidMount() {
        tryGettingTokenFromImplicit()
        this.setState({ mounted: true })
    }

    constructor (props) {
        super(props)
    }

    render () {
        return (
            <Layout name="Login To Explore Your Spotify Data!" hideMenu>
                <PendingState needLogin/>
            </Layout>
        )
    }
}