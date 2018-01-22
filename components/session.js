import React, { Component } from 'react';
import { formatRelative } from 'date-fns'

import Track from '../components/track'
import { backGroundOrange } from '../utils/colors'
import Fade from '../components/transitions/fade'

const SessionDivider = ({playedAt, now, length }) => {
    return (
        <div className="root">
            <div className="top">
                <div>{`Session ${formatRelative(playedAt, now)}`}</div>
                <div>{`${length} ${length > 1 ? 'Songs' : 'Song'}`}</div>
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

// TODO in order for each session to have its own control over expanded state, this component will
// need to connect with graphql since right now it is being passed from the parent
export default class Session extends Component {
    constructor (props) {
        super(props)
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
        const { session, collapse } = this.props
        const { played_at } = session[session.length - 1]
        const now = new Date();
        return (
            <div className={`root${!collapse ? '' : ' collapsed'}`}>
                {
                    <SessionDivider playedAt={new Date(played_at)} now={now} length={session.length}/>
                }
                <Fade in={!collapse}>
                    {!collapse && this.renderTracks()}
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