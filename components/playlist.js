import React, { Component } from 'react';

import Track from '../components/track'
import { backGroundOrange } from '../utils/colors'

const Divider = ({name, totalTracks}) => {
    return (
        <div className="root">
            <div className="top">
                <div>{name}</div>
                <div>{`Total ${totalTracks} ${totalTracks > 1 ? 'Songs' : 'Song'}`}</div>
            </div>
            { /*language=CSS*/ }
            <style jsx>{`
                .root {
                    width: 100%;
                }
                .top {
                    color: white;
                    font-weight: bold;
                    display: flex;
                    justify-content: space-between;
                    padding: .5em .25em;
                    background-color: ${backGroundOrange};
                    text-transform: capitalize;
                    font-size: 1.2em;
                }
            `}</style>
        </div>
    )
}


export default class Playlist extends Component {
    state = { expanded : true }
    constructor (props) {
        super(props)
    }

    renderTracks() {
        const { tracks } = this.props
        return tracks.items.map(({ track }, i) => {
                return <Track key={i} track={track}/>
        })
    }

    render() {
        const { name, totalTracks } = this.props
        return (
            <div className="root">
                {
                    <Divider name={name} totalTracks={totalTracks}/>
                }
                {this.renderTracks()}
                { /*language=CSS*/ }
                <style jsx>{`
                        .root {
                            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
                            border-bottom: .5em solid ${backGroundOrange};
                            border-radius: 6px;
                            width: 100%;
                            max-width: 600px;
                            margin-bottom: 15px;
                            overflow: hidden;
                            transition: box-shadow 300ms ease-in-out;
                        }
                    `}
                </style>
            </div>
        )
    }
}