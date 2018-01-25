import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import LoadingFullScreen from '../components/LoadingFullScreen'
import Layout from '../components/Layout'
import LinkableSummary from '../components/LinkableSummary'

import withData from '../with-apollo/withData'
import checkLogin from '../utils/checkLogin'

const Summary = (props) => {
    const { totalTracks, id, images, owner : { id : ownerId }, external_urls : { spotify }} = props
    const image = images && images[0]
    return <LinkableSummary name={`${totalTracks} ${totalTracks > 1 ? 'Songs' : 'Song'}`} spotifyLink={spotify}
                            image={image} href={`/playlist?id=${id}&ownerId=${ownerId}`}/>
}

const playlistsQuery = gql`
query category($id: String!) {
  category(id: $id) {
    id
    name
    playlists(limit: 50) {
      items {
        ... on Playlist {
          id
          images {
            url
            width
            height
          }
          owner {
            id
            display_name
          }
          name
          totalTracks
          external_urls {
            spotify
          }
        }
      }
    }
  }
}

`

class Index extends Component {
    state = { expanded: true }
    static async getInitialProps ({req, res, query}) {
        const { id } = query
        checkLogin({req, res})
        return { id }
    }

    constructor (props) {
        super(props)
    }


    renderPlaylists () {
        const { data: { category }  } = this.props
        return (
            <div>
                {category.playlists.items.map((playlist, i) => <Summary key={i} {...playlist} />)}
                { /*language=CSS*/ }
                <style jsx>{`
                    div {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                        align-items: center;
                        padding: .5em;
                        flex: 1;
                    }
                `}</style>
            </div>
        )
    }

    render() {
        const { data: { category }  } = this.props
        return (
            <Layout name={category && category.name || "Category"}>
                {category ? this.renderPlaylists() : <LoadingFullScreen/>}
            </Layout>
        )
    }
}

const graphqlOptions = {
    options: (props) => {
        const { id } = props
        return {
            variables: { id }
        }
    }
}

export default withData(graphql(playlistsQuery, graphqlOptions)(Index))