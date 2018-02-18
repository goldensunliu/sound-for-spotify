import React, {Component} from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import Popover from 'react-popover'
import Color from 'color'

import ImageWithLoader from './ImageWithLoader'
import Spinner from '../components/spinner'
import GenresRow from '../components/GenresRow'
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
        return <ImageWithLoader url={image.url}/>
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
                        width: 5em;
                        height: 5em;
                    }
                `}</style>
            </div>
        )
    }
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
        const classified = genres && genres.length > 0
        return (
            <div>
                <div className="name">{name}</div>
                { classified && <GenresRow genres={genres}/> }
                <div className="tip">Tap a genre and discover your taste!</div>
                {/*language=CSS*/}
                <style jsx>{`
                    .name {
                        font-size: 1em;
                        font-weight: 500;
                        margin-bottom: .3em;
                        color: black;
                        text-transform: capitalize;
                    }
                    .tip {
                        text-align: right;
                        font-style: italic;
                    }
                `}</style>
            </div>
        )
    }
    render() {
        const { data } = this.props
        // TODO do the loading
        if (data.loading) return (
            <div className="artist">
                <Spinner/>
                {/*language=CSS*/}
                <style jsx>{`
                    .artist {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;
                        width: 5em;
                        height: 5em;
                    }
                `}</style>
            </div>
        )
        const {name, genres, images, external_urls: { spotify }} = data.artist
        return (
            <div className="artist">
                <Popover style={{ maxWidth: '30em' }} preferPlace="below" body={this.renderPopoverBody()} onOuterAction={this.handleClose}
                             isOpen={this.state.open} refreshIntervalMs={300}>
                        <div onClick={this.toggleOpen}>
                            <ArtistAvatar images={images} name={name}/>
                        </div>
                    </Popover>
                {/*language=CSS*/}
                <style jsx>{`
                    .artist {
                        display: flex;
                        flex-direction: column;
                        cursor: pointer;
                    }
                    .artist :global(.image-with-loader) {
                        width: 5em;
                        height: 5em;
                        border-radius: 50%;
                        overflow: hidden;
                        flex-shrink: 0;
                        transition: box-shadow 0.3s ease-in-out;
                        box-shadow: 0 3px 6px 0 ${Color(backGroundGrey).darken(.5).hsl().string()};
                    }
                    .artist :global(.image-with-loader:hover) {
                        flex-shrink: 0;
                        transition: box-shadow 0.3s ease-in-out;
                        box-shadow: 0 5px 10px 0 ${Color(backGroundGrey).darken(.5).hsl().string()};
                    }
                `}</style>
            </div>
        )
    }
}

export default graphql(artistQuery, graphalOptions)(Artist)
