import React, {Component} from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import ImageWithLoader from './ImageWithLoader'
import Spinner from '../components/spinner'

const artistQuery = gql`
query artist($id: String!) {
  artist(artistId: $id) {
    name
    genres
    images {
      url
      width
      height
    }
    external_urls {
      spotify
    }
  }
}
`

const graphalOptions = {
    options: (props) => {
        const id = props.id
        return {
            variables: {
                id
            }
        }
    },
}

const ArtistAvatar = ({images}) => {
    if (images && images.length) {
        const image = images[0]
        return <ImageWithLoader url={image.url} style={{ width: '4em', height: '4em', borderRadius: '50%', overflow: 'hidden' }}/>
    }
}

const GenreRow = ({genres}) => {
    return (
        <div className="genre-row">
            {genres.map((g, i) => <div className="pill" key={i}>{g}</div>)}
            {/*language=CSS*/}
            <style jsx>{`
                .genre-row {
                    display: flex;
                    flex-wrap: wrap;
                }
                .pill {
                    flex-shrink: 0;
                    display: flex;
                }
            `}</style>
        </div>
    )
}

const Artist = ({data}) => {
    if (data.loading) return <Spinner/>
    const {name, genres, images, external_urls: { spotify }} = data.artist
    return (
        <div className="artist">
            <a href={spotify} target="_blank">
                <ArtistAvatar images={images}/></a>
            <div>
                <div className="name">{name}</div>
                <GenreRow genres={genres}/>
            </div>
            {/*language=CSS*/}
            <style jsx>{`
                .artist {
                    display: flex;
                    align-items: center;
                }
                .artist:not(:last-child) {
                    margin-bottom: .4em;
                }
                .name {
                    font-size: 1em;
                    font-weight: 500;
                }
                .artist :global(.image-with-loader) {
                    flex-shrink: 0;
                    margin-right: .4em;
                }
            `}</style>
        </div>
    )
}

export default graphql(artistQuery, graphalOptions)(Artist)
