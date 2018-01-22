import React, { Component } from 'react';
import { formatRelative } from 'date-fns'

import Track from '../components/track'
import { backGroundOrange } from '../utils/colors'
import Fade from '../components/transitions/fade'

const SessionDivider = ({playedAt, now, toggleExpand }) => {
    return (
        <div className="root" onClick={toggleExpand}>
            <div className="top">{`Session ${formatRelative(playedAt, now)}`}</div>
            { /*language=CSS*/ }
            <style jsx>{`
                .root {
                    width: 100%;
                }
                .top {
                    color: white;
                    font-weight: bold;
                    text-align: center;
                    padding: .5em 0;
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
    render() {
        const { session } = this.props
        const { played_at } = session[session.length - 1]
        const now = new Date();
        const { expanded } = this.state
        return (
            <div className={`root${expanded ? '' : ' collapsed'}`}>
                {
                    <SessionDivider toggleExpand={() => {this.setState({ expanded: !this.state.expanded})}} playedAt={new Date(played_at)} now={now}/>
                }
                <Fade in={this.state.expanded}>
                    {
                        session.map((history, i) => {
                            return <Track key={i} {...history}/>
                        })
                    }
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