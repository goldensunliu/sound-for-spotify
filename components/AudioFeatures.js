import React, {Component} from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import Spinner from '../components/spinner'
import AudioFeatureIcon from '../components/AudioFeatureIcon'

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

// TODO refactor the icon so I can use it in my-tops
// TODO refactor the icon so I can use it in my-tops
const AudioFeatures = ({data}) => {
    if (data.loading) return <Spinner/>
    const audio_features = data.audioFeatures
    return (
        <div className="root">
            <AudioFeatureIcon attributeKey="energy">
                <div>energy</div>
                <div>{Math.round(audio_features.energy * 10)}/10</div>
            </AudioFeatureIcon>
            <AudioFeatureIcon attributeKey="danceability">
                <div>danceability</div>
                <div>{Math.round(audio_features.danceability * 10)}/10</div>
            </AudioFeatureIcon>
            <AudioFeatureIcon attributeKey="tempo">
                <div>tempo</div>
                <div>{Math.round(audio_features.tempo)}BPM</div>
            </AudioFeatureIcon>
            <AudioFeatureIcon attributeKey="valence">
                <div>valence</div>
                <div>{Math.round(audio_features.valence * 10)}/10</div>
            </AudioFeatureIcon>
            <AudioFeatureIcon attributeKey="acousticness">
                <div>acousticness</div>
                <div>{Math.round(audio_features.acousticness * 10)}/10</div>
            </AudioFeatureIcon>
            <AudioFeatureIcon attributeKey="liveness">
                <div>liveness</div>
                <div>{Math.round(audio_features.liveness * 10)}/10</div>
            </AudioFeatureIcon>
            <AudioFeatureIcon attributeKey="speechiness">
                <div>speechiness</div>
                <div>{Math.round(audio_features.speechiness * 10)}/10</div>
            </AudioFeatureIcon>
            {/*language=CSS*/}
            <style jsx>{`
                .root {
                    display: flex;
                    justify-content: center;
                }
                .root :global(.with-popover) {
                    width: 6em;
                    margin-top: .2em;
                }
                @media (max-width: 800px) {
                    .root {
                        flex-wrap: wrap;
                    }
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