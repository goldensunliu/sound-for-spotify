import React, { Component } from 'react';
import { formatRelative } from 'date-fns'

import Track from '../components/track'
import { backGroundOrange } from '../utils/colors'
import Fade from '../components/transitions/fade'

const SessionDivider = ({playedAt, now, length, toggleExpand }) => {
    return (
        <div className="root" onClick={toggleExpand}>
            <div className="top">
                <div>{`Session ${formatRelative(playedAt, now)}`}</div>
                <div>{`${length} ${length > 1 ? 'Songs' : 'Song'}`}</div>
            </div>
            { /*language=CSS*/ }
            <style jsx>{`
                .root {
                    width: 100%;
                    cursor: pointer;
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

    render() {
        const { session } = this.props
        const { expanded } = this.state
        const { played_at } = session[session.length - 1]
        const now = new Date();
        return (
            <div className={`root${!expanded ? '' : ' collapsed'}`}>
                {
                    <SessionDivider toggleExpand={() => {this.setState({ expanded: !this.state.expanded})}} playedAt={new Date(played_at)} now={now} length={session.length}/>
                }
                <Fade in={expanded}>
                    {expanded && this.renderTracks()}
                </Fade>
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