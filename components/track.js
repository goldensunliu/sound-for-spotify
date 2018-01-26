import React, {Component} from 'react'
import {formatRelative} from 'date-fns'
import Color from 'color'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import Link from 'next/link'
import Router from 'next/router'

import Button from '../components/button'
import { Collapse } from 'react-collapse'
import { backGroundOrange, backGroundGrey, backGroundBlue } from '../utils/colors'
import ImageWithLoader from '../components/ImageWithLoader'
import Artist from '../components/Artist'
import AudioFeatures from '../components/AudioFeatures'
import Spinner from '../components/spinner'
import HeadSet from '../images/headset.svg'
import Expand from '../images/expand-more.svg'

const FontColor = Color("#FBE9E7").negate()

const PitchClasses = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const Artists = ({artists}) => {
    return (
        <div className="artists">
            {artists.map((artist, i) => (
                <Artist {...artist} key={i}/>
            ))}
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

const query = gql`
query audioFeatures($id: String!) {
  audioFeatures(id: $id) {
    key
    mode
    time_signature
  }
  track(id: $id) {
    id
    saved
  }
}
`
const saveTrackMutation = gql`
mutation ($trackId: String!) {
    saveTrack(trackId: $trackId) {
      id
      saved
    }
}
`

const graphalOptions = {
    options: ({ track : { id } }) => {
        return {
            variables: {
                id: id
            }
        }
    },
}


class ExpandedContent extends Component {

    // TODO must update cache after mutate
    saveTrack = async () => {
        const { id } = this.props.track
        this.props.mutate({
            variables: { trackId: id }
        })
    }

    constructor(props) {
        super(props)
        const showDetailsLink = Router.route !== '/track'
        this.state = { showDetailsLink }
    }

    render() {
        const { played_at, track : { id, artists }, data, themeColor } = this.props;
        if (data.loading) return <Spinner/>
        const audio_features = data.audioFeatures
        const saved = data.track.saved
        return (
            <div className="root">
                <div className="divider"/>
                <div className="top-row">
                    { played_at ? (
                        <div className="played-at-info">
                            <HeadSet style={{height: '1.4em', width: '1.4em', marginRight: '.6em' }}/>
                            {formatRelative(new Date(played_at), new Date())}
                        </div>) :
                        <div className="played-at-info"/>
                    }
                    <div className="top-row-right-side">
                        { this.state.showDetailsLink && <Link href={`/track?id=${id}`}><a className="details-link">Details</a></Link> }
                        {
                            (saved || this.state.saved || this.state.saving) ?
                                <div className="saved">{this.state.saving ? 'Saving...' : "Saved"}</div> :
                                <Button onClick={this.saveTrack} size="small">Save</Button>
                        }
                    </div>
                </div>
                {audio_features ? <AudioFeatures trackId={id}/>: null}
                <Artists artists={artists}/>
                <div className="music-stuff">
                    <div className="pill">{PitchClasses[audio_features.key]} {audio_features.mode ? 'Major' : 'Minor'}</div>
                    <div className="pill">{audio_features.time_signature} beats/bar</div>
                </div>
                {/*language=CSS*/}
                <style jsx>{`
                    .root {
                        padding-bottom: .6em;
                    }
                    .root>:global(div) {
                        margin-top: .8em;
                    }
                    .divider {
                        border-top: 1px solid ${Color(backGroundGrey).lighten(.6).hsl().string()};
                        padding-top: .6em;
                        width: 90%;
                        margin: auto;
                    }
                    .top-row {
                        font-size: .8em;
                        text-transform: capitalize;
                        margin: 0.4em;
                        justify-content: space-between;
                    }
                    .played-at-info, .top-row, .top-row-right-side {
                        display: flex;
                        align-items: center;
                        font-size: 1em;
                        font-weight: 500;
                    }
                    .music-stuff {
                        text-align: center;
                        display: flex;
                    }
                    .music-stuff .pill {
                        background-color: ${backGroundGrey};
                    }

                    .saved, .details-link {
                        color: ${backGroundOrange};
                        padding: .25em .5em;
                        font-size: 1.2em;
                        border: 1px solid;
                        border-radius: .25em;
                    }
                    .details-link {
                        color: ${backGroundBlue};
                        margin-right: .5em;
                        border-width: .1em;
                    }
                `}</style>
            </div>
        )
    }
}

const ConnectedExpandedContent = compose(graphql(query, graphalOptions), graphql(saveTrackMutation))(ExpandedContent)

class Track extends Component {
    state = { expanded: false }
    static defaultProps = {
      themeColor: backGroundOrange
   }
    constructor(props) {
        super(props)
        this.state = { expanded : props.expanded }
    }
    render() {
        const { track, themeColor } = this.props;
        const { expanded } = this.state
        const { artists, album, external_urls : { spotify } } = track;
        const artistName = artists && artists[0].name
        const albumName = album && album.name
        const coverUrl = album.images && album.images.length && album.images[album.images.length - 1]
        return (
            <div className="wrapper">
                <div className="track-row" onClick={() => { this.setState({ expanded: !expanded })}}>
                    <div className="avatar-and-track">
                        <a href={spotify} target="_blank"><ImageWithLoader url={coverUrl.url} style={{ width: '4em', flexShrink: 0, height: '4em' }}/></a>
                        <div className="truncate flex-column track-info">
                            <div className="truncate" style={{marginBottom: '.3em', fontWeight: 500 }}>{track.name}</div>
                            <div className="truncate" style={{color: FontColor.fade(.3).hsl().string() }}>{artistName} | {albumName}</div>
                        </div>
                    </div>
                    <Expand style={{ width: '1.5em', height: '1.5em' }} className={`expand${expanded ? " expanded" : ""}`}/>
                </div>
                <Collapse isOpened={expanded}>
                    { expanded && <ConnectedExpandedContent {...this.props}/>}
                </Collapse>
                { /*language=CSS*/ }
                <style jsx>{`
                    .wrapper {
                        padding: .3em .2em;
                        position: relative;
                        border-bottom: 1px solid ${Color(themeColor).lighten(.1).hsl().string()};
                        background: linear-gradient(45deg, #FBE9E7, #ffffff);
                        color: ${FontColor.hsl().string()};
                    }
                    .track-row {
                        display: flex;
                        align-items: center;
                        height: 4.2em;
                        justify-content: space-between;
                        cursor: pointer;
                    }
                    .track-row :global(.expand) {
                        transform: rotate(90deg);
                        transition: all .25s;
                    }
                    .track-row :global(.expanded) {
                        transform: rotate(0deg);
                    }
                    .avatar-and-track {
                        display: flex;
                        align-items: center;
                        flex: 1;
                        overflow: hidden;
                    }
                    .avatar-and-track :global(img) {
                        width: 4em;
                        border-radius: 2px;
                        object-fit: contain;
                    }
                    .avatar-and-track :global(.spinner) {
                        width: 4em;
                        flex-shrink: 0;
                    }
                    .track-info {
                        margin-left: .5em;
                    }
                    .flex-column {
                        display: flex;
                        flex-direction: column;
                    }
                `}
                </style>
            </div>
        )
    }
}

export default Track