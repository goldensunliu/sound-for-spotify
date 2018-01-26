import React, {Component} from 'react'

import WithExplainationPopover from './WithExplainationPopover'

import Battery from '../images/battery-with-a-bolt.svg'
import DiscoBall from '../images/disco-ball.svg'
import Metronome from '../images/metronome.svg'
import Positivity from '../images/positivity.svg'
import Guitar from '../images/acoustic-guitar.svg'
import Chat from '../images/chat.svg'
import Hand from '../images/hand.svg'


const keyToIcon = {
    energy: Battery,
    danceability: DiscoBall,
    tempo: Metronome,
    valence: Positivity,
    acousticness: Guitar,
    liveness: Hand,
    speechiness: Chat
}

const AudioFeatureIcon = ({attributeKey, children}) => {
    const Icon = keyToIcon[attributeKey]
    return (
        <WithExplainationPopover attributeKey={attributeKey} render={(state) => (
            <div className="attribute">
                <Icon/>
                {children}
                {/*language=CSS*/}
                <style jsx>{`
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
        )}/>
    )
}

export default AudioFeatureIcon