import React from 'react'
import Router from 'next/router'
import withSentry from '../raven'
// TODO when react router is in next. use that for better redirects
class Index extends React.Component {
  static async getInitialProps({ res }) {
    if (res) {
      res.redirect(`/my-tops`)
    } else {
      Router.replace('/my-tops')
    }
    return {}
  }
}
export default withSentry(Index)