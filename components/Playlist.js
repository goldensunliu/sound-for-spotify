import React, { Component } from 'react';
import { Collapse } from 'react-collapse'

import Track from '../components/track'
import { backGroundOrange } from '../utils/colors'
import Expand from '../images/expand-more.svg'

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

    renderDivider() {
        const { name } = this.props
        const { expanded } = this.state
        const onClick = this.props.collapsable && this.toggleExpand
        return (
            <div className="root" onClick={onClick}>
                <div className="top">
                    <div className="name">{name}</div>
                    { onClick && <Expand style={{ width: '1.5em', height: '1.5em' }} className={`expand${expanded ? " expanded" : ""}`}/>}
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
                    .top :global(.expand) {
                        transform: rotate(90deg);
                        transition: all .25s;
                        fill: white;
                    }
                    .top :global(.expanded) {
                        transform: rotate(0deg);
                    }
            `}</style>
            </div>
        )
    }

    render() {
        const { expanded } = this.state
        return (
            <div className={`root${expanded ? " expanded" : ""}`}>
                {this.renderDivider()}
                <Collapse isOpened={expanded} hasNestedCollapse>
                    {this.renderTracks()}
                </Collapse>
                { /*language=CSS*/ }
                <style jsx>{`
                        .root {
                            box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
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
                        .root.expanded {
                            border-bottom: .4em solid ${backGroundOrange};
                            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
                        }
                    `}
                </style>
            </div>
        )
    }
}