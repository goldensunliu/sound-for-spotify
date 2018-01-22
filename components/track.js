import React, {Component} from 'react'
import Image from 'react-image'
import {formatRelative} from 'date-fns'
import Color from 'color'
import Popover from 'react-popover'

import Button from '../components/button'
import Grow from "./transitions/grow"
import { backGroundOrange, backGroundGrey } from '../utils/colors'
import { AttributeConfig } from '../utils/AttributeConfig'
import Spinner from '../components/spinner'

import HeadSet from '../images/headset.svg'
import Expand from '../images/expand-more.svg'
import Battery from '../images/battery-with-a-bolt.svg'
import DiscoBall from '../images/disco-ball.svg'
import Metronome from '../images/metronome.svg'
import Positivity from '../images/positivity.svg'
import Guitar from '../images/acoustic-guitar.svg'
import Chat from '../images/chat.svg'
import Hand from '../images/hand.svg'

const FontColor = Color("#FBE9E7").negate()

const PitchClasses = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

class WithExplainationPopover extends React.Component {
    state = { open: false }
    handleClose = () => {
        this.setState({open: false});
    };
    toggleOpen = (event) => {
        // This prevents ghost click.
        event.preventDefault();
        this.setState({open: !this.state.open});
    }
    render() {
        const { label, explanation } = AttributeConfig[this.props.attributeKey];
        const body = (
            <div>
                <div className="headline">{label}</div>
                <div className="content">{explanation}</div>
                {/*language=CSS*/}
                <style jsx>{`
                    .headline {
                        font-size: 1.5em;
                        line-height: 32px;
                    }
                    .content {
                        text-align: justify;
                    }
                `}</style>
            </div>
        )
        return (
            <Popover style={{ width: '80vw', maxWidth: '20em' }} preferPlace="below" body={body} onOuterAction={this.handleClose}
                     isOpen={this.state.open} refreshIntervalMs={300}>
                <div onClick={this.toggleOpen}>
                    {this.props.render(this.state)}
                </div>
            </Popover>
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
                }
            `}</style>
        </div>
    )
}

const Artists = ({artists}) => {
    return (
        <div className="artists">
            {artists.map(({name, genres, images}) => (
                <div className="artist">
                    <ArtistAvatar images={images}/>
                    <div>
                        <div className="name">{name}</div>
                        <GenreRow genres={genres}/>
                    </div>
                </div>
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

const Attributes = ({audio_features}) => {
    return (
        <div className="root">
            <WithExplainationPopover attributeKey="energy" render={(state) => (
                <div className="attribute">
                    <Battery/>
                    <div>{Math.round(audio_features.energy * 10)}/10</div>
                </div>
            )}/>
            <WithExplainationPopover attributeKey="danceability" render={(state) => (
                <div className="attribute">
                    <DiscoBall/>
                    <div>{Math.round(audio_features.danceability * 10)}/10</div>
                </div>
            )}/>
            <WithExplainationPopover attributeKey="tempo" render={(state) => (
                <div className="attribute">
                    <Metronome/>
                    <div>{Math.round(audio_features.tempo)}BPM</div>
                </div>
            )}/>
            <WithExplainationPopover attributeKey="valence" render={(state) => (
                <div className="attribute">
                    <Positivity/>
                    <div>{Math.round(audio_features.valence * 10)}/10</div>
                </div>
            )}/>
            <WithExplainationPopover attributeKey="acousticness" render={(state) => (
                <div className="attribute">
                    <Guitar/>
                    <div>{Math.round(audio_features.acousticness * 10)}/10</div>
                </div>
            )}/>
            <WithExplainationPopover attributeKey="liveness" render={(state) => (
                <div className="attribute">
                    <Hand/>
                    <div>{Math.round(audio_features.liveness * 10)}/10</div>
                </div>
            )}/>

            <WithExplainationPopover attributeKey="speechiness" render={(state) => (
                <div className="attribute">
                    <Chat/>
                    <div>{Math.round(audio_features.speechiness * 10)}/10</div>
                </div>
            )}/>
            {/*language=CSS*/}
            <style jsx>{`
                .root {
                    display: flex;
                    justify-content: space-around;
                }
                .attribute {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    cursor: pointer;
                }
                .attribute :global(svg) {
                    height: 30px;
                    width: 30px;
                }
            `}</style>
        </div>
    )
}

class ExpandedContent extends Component {
    state = {}

    // TODO bring this back via graphql
    saveTrack = async () => {
        const token = getStoredToken();
        // this really shouldn't happen
        if (!token) return
        // don't flash the loading state if it saves under 200 ms
        setTimeout(() => {
            if (!this.state.saved) {
                this.setState( { saving: true })
            }
        }, 200)
        const { track: { id } } = this.props;
        const res = await saveTrackToLib(token, id);
        if (res.status == 200) {
            this.setState({ saved: true })
        }
        this.setState( { saving: false })
    }

    render() {
        const { played_at, track : { audio_features, artists } } = this.props;
        return (
            <div className="root">
                <div className="divider"/>
                <div className="played-at-row">
                    <div className="played-at-info">
                        <HeadSet style={{height: '1.4em', width: '1.4em', marginRight: '.6em' }}/>
                        {formatRelative(new Date(played_at), new Date())}
                    </div>
                </div>
                {audio_features ? <Attributes audio_features={audio_features}/>: null}
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
                    .played-at-row {
                        font-size: .8em;
                        text-transform: capitalize;
                        margin: 0.4em;
                        justify-content: space-between;
                    }
                    .played-at-info, .played-at-row {
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
                    .saved {
                        color: ${backGroundOrange};
                        padding: .25em .5em;
                        font-size: 1.2em;
                        border: 1px solid;
                        border-radius: .25em;
                    }
                `}</style>
            </div>
        )
    }
}

const ArtistAvatar = ({images}) => {
    if (images && images.length) {
        const image = images[0]
        return <ImageWithLoader url={image.url} style={{ width: '4em', height: '4em', borderRadius: '50%', overflow: 'hidden' }}/>
    }
}

const ImageWithLoader = ({url, style}) => (
    <div className="image-with-loader" style={style}>
        <Image src={url} loader={<Spinner/>}/>
        { /*language=CSS*/ }
        <style jsx>{`
            .image-with-loader {
                display: grid;
            }
            .image-with-loader :global(.spinner) {
                width: 100%;
            }
            .image-with-loader :global(img) {
                width: 100%;
                height: 100%;
                border-radius: 2px;
                object-fit: cover;
            }
        `}
        </style>
    </div>
)

class Track extends Component {
    state = { expanded: false }
    render() {
        const {track } = this.props;
        const { expanded } = this.state
        const { artists, album } = track;
        const artistName = artists && artists[0].name
        const albumName = album && album.name
        const coverUrl = album.images && album.images.length && album.images[album.images.length - 1]
        return (
            <div className="wrapper">
                <div className="track-row" onClick={() => { this.setState({ expanded: !expanded })}}>
                    <div className="avatar-and-track">
                        <ImageWithLoader url={coverUrl.url} style={{ width: '4em', flexShrink: 0, height: '4em' }}/>
                        <div className="truncate flex-column track-info">
                            <div className="truncate" style={{marginBottom: '.3em', fontWeight: 500 }}>{track.name}</div>
                            <div className="truncate" style={{color: FontColor.fade(.3).hsl().string() }}>{artistName} | {albumName}</div>
                        </div>
                    </div>
                    <Expand style={{ width: '1.5em', height: '1.5em' }} className={`expand${expanded ? " expanded" : ""}`}/>
                </div>
                <Grow in={expanded} maxHeight={500}>
                    <ExpandedContent {...this.props}/>
                </Grow>
                { /*language=CSS*/ }
                <style jsx>{`
                    .wrapper {
                        padding: .3em .2em;
                        position: relative;
                        border-bottom: 1px solid ${Color(backGroundOrange).lighten(.1).hsl().string()};
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