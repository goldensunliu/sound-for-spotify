import React, {Component} from 'react'
import Link from 'next/link'
import Popover from 'react-popover'
import PropTypes from 'prop-types';

import Button from '../components/button'
import {backGroundOrange} from "../utils/colors";

const COPY_MAP = {
    short_term: 'Short',
    medium_term: 'Medium',
    long_term: 'Long',
}

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
        if (timeRange !== range) {
            return (
                <Button size="mid">
                    <Link href={`${route}?timeRange=${range}`}>{COPY_MAP[range]}</Link>
                </Button>
            )
        }
        return (
            <div className="copy">
                {COPY_MAP[range]}
                {/*language=CSS*/}
                <style jsx>{`
                    .copy {
                        padding: 5px 10px;
                        font-size: 1.4em;
                        font-weight: bold;
                        color: ${backGroundOrange};
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
