import React, {Component} from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import Battery from '../images/battery-with-a-bolt.svg'
import DiscoBall from '../images/disco-ball.svg'
import Metronome from '../images/metronome.svg'
import Positivity from '../images/positivity.svg'
import Guitar from '../images/acoustic-guitar.svg'
import Chat from '../images/chat.svg'
import Hand from '../images/hand.svg'

import Spinner from '../components/spinner'
import WithExplainationPopover from '../components/WithExplainationPopover'

const query = gql`
query audioFeatures($id: String!) {
  audioFeatures(id: $id) {
    acousticness
    danceability
    duration_ms
    energy
    instrumentalness
    key
    liveness
    loudness
    mode
    speechiness
    tempo
    time_signature
    valence
  }
}
`

const AudioFeatures = ({data}) => {
    if (data.loading) return <Spinner/>
    const audio_features = data.audioFeatures
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

const graphalOptions = {
    options: ({ trackId }) => {
        return {
            variables: {
                id: trackId
            }
        }
    },
}

export default graphql(query, graphalOptions)(AudioFeatures)