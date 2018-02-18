import React, {Component} from 'react'
import Link from 'next/link'
import Popover from 'react-popover'
import PropTypes from 'prop-types';
import css from 'styled-jsx/css'

import Button from '../components/button'
import {backGroundBlue, backGroundOrange} from "../utils/colors";

const COPY_MAP = {
    short_term: 'Short',
    medium_term: 'Medium',
    long_term: 'Long',
}

{/*language=CSS*/}
const CopyStyle = css`
.copy {
    padding: 5px 10px;
    font-size: 1.4em;
    font-weight: bold;
}
`

export default class TimeControl extends Component {
    state = {}
    handleClose = () => {
        this.setState({open: false});
    }
    toggleOpen = (event) => {
        // This prevents ghost click.
        event.preventDefault();
        this.setState({open: !this.state.open});
    }

    renderRangeControl(range) {
        const { timeRange, route } = this.props
        const isActive = timeRange === range
        return (
            <div className="copy">
                { !isActive ?
                    <Link prefetch href={`${route}?timeRange=${range}`}><a>{COPY_MAP[range]}</a></Link> :
                    COPY_MAP[range]
                }
                {/*language=CSS*/}
                <style jsx>{CopyStyle}
                </style>
                {/*language=CSS*/}
                <style jsx>{`
                    .copy {
                        color: ${isActive ? backGroundOrange : backGroundBlue};
                        cursor: ${isActive ? "initial" : "pointer"};
                    }
                `}
                </style>
            </div>
        )
    }

    renderControl() {
        return (
            <div>
                <div className="flex">
                    {this.renderRangeControl('short_term')}
                    {this.renderRangeControl('medium_term')}
                    {this.renderRangeControl('long_term')}
                </div>
                {/*language=CSS*/}
                <style jsx>{`
                    .flex {
                        justify-content: space-between;
                        display: flex;
                        width: 18em;
                    }
                `}
                </style>
            </div>
        )
    }
    render() {
        return (
            <div className="time-control">
                <Popover isOpen={this.state.open} preferPlace="above" body={this.renderControl()} onOuterAction={this.handleClose}>
                    <Button size="mid" onClick={this.toggleOpen}>
                        Time Range
                    </Button>
                </Popover>
                {/*language=CSS*/}
                <style jsx>{`
                    .time-control {
                        position: fixed;
                        bottom: 1em;
                        left: calc(50% - 4.5em);
                        z-index: 1;
                    }
                `}
                </style>
            </div>
        )
    }
}

TimeControl.propTypes = {
    timeRange: PropTypes.string.isRequired,
    route: PropTypes.string.isRequired,
}
