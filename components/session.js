import React, { Component } from 'react';
import { formatRelative } from 'date-fns'

import Track from '../components/track'
import { backGroundOrange } from '../utils/colors'
import { Collapse } from 'react-collapse'
import Expand from '../images/expand-more.svg'

const SessionDivider = ({playedAt, now, length, toggleExpand, expanded }) => {
    return (
        <div className="root" onClick={toggleExpand}>
            <div className="top">
                <div className="title">{`Session ${formatRelative(playedAt, now)}`}</div>
                <div>{`${length} ${length > 1 ? 'Songs' : 'Song'}`}</div>
                <Expand style={{ width: '1.5em', height: '1.5em' }} className={`expand${expanded ? " expanded" : ""}`}/>
            </div>
            { /*language=CSS*/ }
            <style jsx>{`
                .root {
                    width: 100%;
                    cursor: pointer;
                }
                .title {
                    flex: 1;
                }
                .root :global(.expand) {
                    transform: rotate(90deg);
                    transition: all .25s;
                    fill: white;
                }
                .root :global(.expanded) {
                    transform: rotate(0deg);
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

// Sessions are processed on the UI layer from the recently played graphql query
// TODO split session in the props option of apollo layer
export default class Session extends Component {
    state = {
        expanded : true
    }

    constructor (props) {
        super(props)
        this.state.expanded = !props.collapse
    }

    componentWillReceiveProps({ collapse }) {
        if (this.props.collapse  != collapse)
        {
            this.setState({ expanded: !collapse })
        }
    }

    renderTracks() {
        const { session } = this.props
        return (
            session.map((history, i) => {
                return <Track key={i} {...history}/>
            })
        )
    }

    toggleExpand = () => {this.setState({ expanded: !this.state.expanded})}

    render() {
        const { session } = this.props
        const { expanded } = this.state
        const { played_at } = session[session.length - 1]
        const now = new Date();
        return (
            <div className={`root${expanded ? '' : ' collapsed'}`}>
                {
                    <SessionDivider expanded={expanded} toggleExpand={this.toggleExpand} playedAt={new Date(played_at)} now={now} length={session.length}/>
                }
                <Collapse isOpened={expanded} hasNestedCollapse>
                    {expanded && this.renderTracks()}
                </Collapse>
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
                        .root.collapsed {
                            box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
                        }
                    `}
                </style>
            </div>
        )
    }
}