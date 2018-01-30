import React, {Component} from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import Popover from 'react-popover'
import Color from 'color'

import ImageWithLoader from './ImageWithLoader'
import Spinner from '../components/spinner'
import { backGroundOrange, backGroundGrey } from "../utils/colors"


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

const ArtistAvatar = ({images, name}) => {
    if (images && images.length) {
        const image = images[0]
        return <ImageWithLoader url={image.url} style={{ width: '5em', height: '5em', borderRadius: '50%', overflow: 'hidden' }}/>
    } else {
        const initials = name.split(" ").map(word => word[0]).join("")
        return (
            <div className="initials">
                {initials}
                {/*language=CSS*/}
                <style jsx>{`
                    .initials {
                        border: 2px solid ${backGroundOrange};
                        color: ${backGroundOrange};
                        font-weight: bold;
                        border-radius: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 4em;
                        height: 4em;
                    }
                `}</style>
            </div>
        )
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
                    font-size: 1.1em;
                    margin: .25em;
                    padding: .2em .6em;
                    box-shadow: 0 1.5px 3px 0 ${Color(backGroundOrange).darken(.5).hsl().string()};
                }
            `}</style>
        </div>
    )
}

class Artist extends Component {
    state = { open: false }
    handleClose = () => {
        this.setState({open: false});
    }
    toggleOpen = (event) => {
        // This prevents ghost click.
        event.preventDefault();
        this.setState({open: !this.state.open});
    }

    renderPopoverBody() {
        const { name, genres } = this.props.data.artist
        return (
            <div>
                <div className="name">{name} is associated with:</div>
                <GenreRow genres={genres}/>
                {/*language=CSS*/}
                <style jsx>{`
                    .name {
                        font-size: 1em;
                        font-weight: 500;
                        margin-bottom: .3em;
                        color: black;
                        text-transform: capitalize;
                    }
                `}</style>
            </div>
        )
    }
    render() {
        const { data } = this.props
        if (data.loading) return <Spinner/>
        const {name, genres, images, external_urls: { spotify }} = data.artist
        return (
            <div className="artist">
                <Popover style={{ maxWidth: '30em' }} preferPlace="below" body={this.renderPopoverBody()} onOuterAction={this.handleClose}
                             isOpen={this.state.open} refreshIntervalMs={300}>
                        <div style={{ width: '5em' }} onClick={this.toggleOpen}>
                            <ArtistAvatar images={images} name={name}/>
                        </div>
                    </Popover>
                {/*language=CSS*/}
                <style jsx>{`
                    .artist {
                        display: flex;
                        flex-direction: column;
                    }
                    .artist :global(.image-with-loader) {
                        flex-shrink: 0;
                        box-shadow: 0 2px 4px 0 ${Color(backGroundGrey).darken(.5).hsl().string()};
                    }
                `}</style>
            </div>
        )
    }
}

export default graphql(artistQuery, graphalOptions)(Artist)
