import React, {Component} from 'react'
import { graphql, compose } from 'react-apollo'
import Link from 'next/link'
import gql from 'graphql-tag'
import Popover from 'react-popover'
import { toast } from 'react-toastify';

import Layout from '../components/Layout'
import {backGroundBlue, backGroundGreen, backGroundOrange} from "../utils/colors";
import GenresRow from '../components/GenresRow'
import checkLogin from '../utils/checkLogin'
import withSentry from '../raven'
import withData from '../with-apollo/withData'
import LoadingFullScreen from '../components/LoadingFullScreen'
import { withFollowPlaylist, withUnfollowPlaylist } from '../components/graphqlHelpers'
import Help from '../images/help-button.svg'

const edgeCopy = (genre) => `Some recent less-known music that fans of ${genre} are listening to now`
const pulseCopy = (genre) => `The music that fans of ${genre} are listening to now`
const coreCopy = (genre) => `An attempted algorithmic core music of ${genre}`
const introCopy = (genre) => `An attempted algorithmic introduction to ${genre} based on math and listening data`
const lastYearCopy = (genre) => `New or newly released songs most distinctively popular among fans of ${genre} in 2017`

class PlaylistInfo extends Component {
    state = { open: false }

    componentWillReceiveProps(nextProps) {
        const { name } = this.props
        const { following } = this.props.playlist
        if (following !== nextProps.playlist.following)
        {
            const msg = `${nextProps.playlist.following ? "Following": "Unfollowed"} ${name}!`
            toast.success(msg, {
                position: toast.POSITION.TOP_CENTER
            })
        }
    }
    followPlaylist = async () => {
        const { id: playlistId, owner: { id: ownerId } } = this.props.playlist
        this.props.followPlaylist({
            variables: { playlistId, ownerId }
        })
    }

    unfollowPlaylist = async () => {
        const { id: playlistId, owner: { id: ownerId } } = this.props.playlist
        this.props.unfollowPlaylist({
            variables: { playlistId, ownerId }
        })
    }

    handleClose = () => {
        this.setState({open: false});
    };
    toggleOpen = (event) => {
        // This prevents ghost click.
        event.preventDefault();
        this.setState({open: !this.state.open});
    }

    render() {
        const { playlist, name, copy } = this.props
        const { following, id: playlistId, owner: { id: ownerId } } = playlist
        return (
            <div className="playlist">
                <div className="block">
                    <Popover style={{ width: '70vw', maxWidth: '40em' }} preferPlace="below" body={copy} onOuterAction={this.handleClose}
                             isOpen={this.state.open} refreshIntervalMs={300}>
                        <div className="name" onClick={this.toggleOpen}>
                            {name} <Help style={{width: '.8em', marginLeft: '.2em', fill: backGroundOrange }}/>
                        </div>
                    </Popover>
                    <div className="ctas">
                        <div className={`bottom-cta${following ? " unfollow" : ""}`} onClick={following ? this.unfollowPlaylist : this.followPlaylist}>
                            {following ? "Unfollow" : "Follow"}
                        </div>
                        <Link href={`/playlist?id=${playlistId}&ownerId=${ownerId}`}>
                            <a className={`details-cta`}>
                                Details
                            </a>
                        </Link>
                    </div>
                </div>
                { /*language=CSS*/ }
                <style jsx>{`
                    .playlist {
                        display: flex;
                        flex-direction: column;
                        color: ${backGroundOrange};
                        cursor: pointer;
                    }
                    .name {
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 100%;
                        text-align: center;
                        font-size: 1.3em;
                    }
                    .ctas {
                        width: 100%;
                        font-size: 1.1em;
                        line-height: 2em;
                        text-align: center;
                        color: white;
                        display: flex;
                    }
                    .bottom-cta {
                        background-color: ${backGroundOrange};
                        transition: background-color .3s ease-in-out;
                        width: 50%;
                    }
                    .bottom-cta.unfollow {
                        background-color: ${backGroundGreen};
                    }
                    .details-cta {
                        background-color: ${backGroundBlue};
                        width: 50%;
                    }
                    .playlist .block {
                        font-size: 1.1em;
                        font-weight: 500;
                        cursor: pointer;
                        text-transform: capitalize;
                        height: 5em;
                        width: 11em;
                        border: 2px solid ${backGroundOrange};
                        border-radius: .4em;
                        display: flex;
                        align-items: center;
                        margin: .5em .5em;
                        box-shadow: 0 3px 6px rgba(0,0,0,0.12), 0 3px 6px rgba(0,0,0,0.24);
                        flex-direction: column;
                        justify-content: space-between;
                    }
                `}</style>
            </div>
        )
    }
}

const ConnectedPlaylistInfo = compose(
    withFollowPlaylist,
    withUnfollowPlaylist
)(PlaylistInfo)

const ExplainationBody = (({genre}) => (
    <div>a collection of algorithmically-generated playlists of the {genre} genre-space, based on data tracked and analyzed by Spotify.</div>
))

class Explaination extends Component {
    state = { open: false }
    toggleOpen = (event) => {
        // This prevents ghost click.
        event.preventDefault();
        this.setState({open: !this.state.open});
    }

    close = () => {
        this.setState({open: false});
    }

    open = () => {
        this.setState({open: true});
    }

    render() {
        const { genre } = this.props
       return (
           <Popover className="with-popover" style={{ width: '90vw', maxWidth: '40em' }}
                    isOpen={this.state.open} body={<ExplainationBody genre={genre}/>} preferPlace="below">
               <div className={`discover`} onClick={this.toggleOpen} onMouseEnter={this.open} onMouseLeave={this.close}>
                Discover <Help style={{width: '.8em', marginLeft: '.2em' }}/>
                { /*language=CSS*/ }
                <style jsx>{`
                    .discover {
                        font-size: 2em;
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                    }
                `}</style>
               </div>

           </Popover>
       )
    }
}

class Index extends Component {
    constructor (props) {
        super(props)
    }
    static async getInitialProps ({req, res, query}) {
        const { id } = query
        checkLogin({req, res})
        return { id }
    }

    renderCore() {
        const { genreNoises, id } = this.props
        const { corelist, pulse, edge, intro, lastYear } = genreNoises
        // defensive filter out of nulls
        const related = genreNoises.related.filter((i) => i)
        return (
            <div className="root">
                <div className="playlists-lay-out">
                    <div className={`genre`}>{id}</div>
                    <Explaination genre={id}/>
                    <div className="playlists">
                        { intro && <ConnectedPlaylistInfo playlist={intro} name="The Intro" copy={introCopy(id)}/>}
                        { corelist &&  <ConnectedPlaylistInfo playlist={corelist} name="The Sound" copy={coreCopy(id)}/>}
                        { pulse && <ConnectedPlaylistInfo playlist={pulse} name="The Pulse" copy={pulseCopy(id)}/>}
                        { edge &&  <ConnectedPlaylistInfo playlist={edge} name="The Edge" copy={edgeCopy(id)}/>}
                        { lastYear && <ConnectedPlaylistInfo playlist={lastYear} name="2017" copy={lastYearCopy(id)}/>}
                    </div>
                </div>
                <div className="genres">
                    <div className={`related`}>Related Genres</div>
                    <GenresRow genres={genreNoises.related.map(({id}) => id )}/>
                </div>
                { /*language=CSS*/ }
                <style jsx>{`
                    .playlists-lay-out {
                        display: flex;
                        align-items: center;
                        width: 100%;
                        flex-direction: column;
                    }
                    .related {
                        font-size: 1.5em;
                        text-align: center;
                        margin-top: .3em;
                        margin-bottom: .3em;
                    }
                    .genres :global(.genre-row) {
                        justify-content: center;
                        font-size: 1.2em;
                    }
                    .genre {
                        text-transform: capitalize;
                        font-size: 3.5em;
                        margin-top: .2em;
                        margin-bottom: .3em;
                        text-align: center;
                    }
                    .playlists {
                        display: flex;
                        flex-wrap: wrap;
                        align-items: center;
                        justify-content: center;
                    }
                    .root {
                        display: flex;
                        flex-wrap: wrap;
                        align-items: center;
                        justify-content: center;
                        width: 100%;
                        max-width: 600px;
                        margin: auto;
                    }
                `}</style>
            </div>
        )
    }

    render() {
        const { genreNoises, data : { loading } } = this.props
        return (
            <Layout name={`${this.props.id}`}>
                {genreNoises && !loading ? this.renderCore() : <LoadingFullScreen/>}
            </Layout>
        )
    }
}

const genreQuery = gql`
fragment fieldsForPlaylist on Playlist {
  id
  name
  description
  totalTracks
  following
  owner {
    id
  }
}

query genre($id: String!) {
  genreNoises(genres: [$id]) {
    id
    intro {
      ...fieldsForPlaylist
    }
    lastYear {
      ...fieldsForPlaylist
    }
    corelist {
      ...fieldsForPlaylist
    }
    edge {
      ...fieldsForPlaylist
    }
    pulse {
      ...fieldsForPlaylist
    }
    related {
      id
    }
  }
}
`

const graphqlOptions = {
    options: (props) => {
        const { id } = props
        return {
            variables: { id }
        }
    },
    props: (props) => {
        let { data : { genreNoises, loading } } = props
        if (genreNoises && !loading) {
            genreNoises = genreNoises[0]
        }
        return { genreNoises, ...props }
    }
}

export default withSentry(withData(
    graphql(genreQuery, graphqlOptions)(Index)
))