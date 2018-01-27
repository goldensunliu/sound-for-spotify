import React from 'react'
import Router from 'next/router'
import withSentry from '../raven'
// TODO when react router is in next. use that for better redirects
class Index extends React.Component {
  static async getInitialProps({ res }) {
    if (res) {
      res.redirect(`/recently-played`)
    } else {
      Router.replace('/recently-played')
    }
    return {}
  }
}
export default withSentry(Index)