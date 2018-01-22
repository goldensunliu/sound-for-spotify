import React from 'react'
import Router from 'next/router'

// TODO when react router is in next. use that for better redirects
export default class extends React.Component {
  static async getInitialProps({ res }) {
    if (res) {
      res.redirect(`/recently-played`)
    } else {
      Router.replace('/recently-played')
    }
    return {}
  }
}