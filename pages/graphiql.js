import React, { Component } from 'react'

import checkLogin from '../utils/checkLogin'

import GraphQLExplorer from '../GraphQLExplorer'

export default class Index extends Component {
    state = {}
    static async getInitialProps ({req, res, query}) {
        checkLogin({req, res})
        return { needLogin: false, userAgent: req ? req.headers['user-agent'] : navigator.userAgent }
    }
    componentDidMount() {
        this.setState({ mounted: true })
    }

    constructor (props) {
        super(props)
    }

    render () {
        return this.state.mounted ? GraphQLExplorer : "Loading"
    }
}