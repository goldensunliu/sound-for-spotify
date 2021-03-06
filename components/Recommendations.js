import React, { Component } from 'react';

import Track from '../components/track'
import { backGroundBlue } from '../utils/colors'

const Divider = ({name}) => {
    return (
        <div className="root">
            <div className="top">
                <div>{name}</div>
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
                    background-color: #377BA4;
                    text-transform: capitalize;
                    font-size: 1.2em;
                }
            `}</style>
        </div>
    )
}


export default class Recommendations extends Component {
    state = { expanded : true }
    constructor (props) {
        super(props)
    }

    renderTracks() {
        const { tracks } = this.props
        return tracks.map((track, i) => {
                return <Track key={i} track={track} themeColor={backGroundBlue}/>
        })
    }

    render() {
        const { name } = this.props
        return (
            <div className="root">
                {
                    <Divider name={name}/>
                }
                {this.renderTracks()}
                { /*language=CSS*/ }
                <style jsx>{`
                        .root {
                            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
                            border-bottom: .5em solid ${backGroundBlue};
                            border-radius: 6px;
                            width: 100%;
                            margin-bottom: 15px;
                            overflow: hidden;
                            transition: box-shadow 300ms ease-in-out;
                        }
                        @media (min-width: 800px) {
                            .root {
                                width: 600px;
                            }
                        }
                    `}
                </style>
            </div>
        )
    }
}