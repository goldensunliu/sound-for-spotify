import React, { Component } from 'react';

import Track from '../components/track'
import { backGroundOrange } from '../utils/colors'
import { Collapse } from 'react-collapse'


const Divider = ({name, onClick, expanded}) => {
    return (
        <div className="root" onClick={onClick}>
            <div className="top">
                <div className="name">{name}</div>
                { onClick && <div>{expanded ? "Collapse" : "Expand"}</div>}
            </div>
            { /*language=CSS*/ }
            <style jsx>{`
                .root {
                    width: 100%;
                }
                .name {
                    font-size: 1.2em;
                }
                .top {
                    color: white;
                    font-weight: bold;
                    display: flex;
                    justify-content: space-between;
                    padding: .5em .5em;
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
        this.state.expanded = !props.isCollapsed
    }

    toggleExpand = () => {
        if (!this.props.collapsable) return
        this.setState({ expanded: !this.state.expanded})
    }

    renderTracks() {
        const { tracks } = this.props
        return tracks.map((track, i) => {
                return <Track key={i} track={track}/>
        })
    }

    render() {
        const { name, totalTracks, tracks } = this.props
        const { expanded } = this.state
        return (
            <div className="root">
                {
                    <Divider name={name} onClick={this.props.collapsable && this.toggleExpand} expanded={expanded}/>
                }
                <Collapse isOpened={expanded} hasNestedCollapse>
                    {this.renderTracks()}
                </Collapse>
                { /*language=CSS*/ }
                <style jsx>{`
                        .root {
                            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
                            border-bottom: .5em solid ${backGroundOrange};
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