import React, { Component } from 'react'
import {backGroundOrange} from "../utils/colors";

class SoundBar extends Component {
    static defaultProps = {
        maxBars : 5
    }

    constructor(props) {
        super(props)
        this.state = { numOfBars: props.maxBars }
    }
    componentDidMount() {
        this.update = setTimeout(this.updateBar, Math.round(1000 * Math.random()))
    }

    componentWillUnmount() {
        clearTimeout(this.update)
    }

    updateBar = () => {
        const { maxBars } = this.props
        this.setState({ numOfBars: Math.round((maxBars -1) * Math.random()) + 1});
        setTimeout(this.updateBar, Math.round(1000 * Math.random()))
    }

    render() {
        const { numOfBars } = this.state;
        return (
            <div className="bar-wrapper">
                {
                    [...Array(numOfBars).keys()].map((e, i) => (
                        <div className="bar" key={i}/>
                    ))
                }
                { /*language=CSS*/ }
                <style jsx>{`
                    .bar-wrapper {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .bar {
                        margin-top: .1em;
                        width: 1em;
                        height: .4em;
                        margin-bottom: .1em;
                        background-color: ${backGroundOrange};
                        border-radius: 2px;
                    }
                `}
                </style>
            </div>
        )
    }
}

class Brand extends Component {
    render() {
        return (
            <div className="sound-brand">
                <div className="bars">
                    <SoundBar/>
                    <SoundBar/>
                    <SoundBar/>
                    <SoundBar/>
                    <SoundBar/>
                </div>
                <div className="sound">
                    Sound
                </div>
                { /*language=CSS*/ }
                <style jsx>{`
                    .sound-brand {
                        height: 12em;
                        width: 12em;
                        border-radius: 50%;
                        border: 4px solid ${backGroundOrange};
                        background-color: white;
                        color: ${backGroundOrange};
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    }
                    .bars {
                        display: flex;
                        align-items: flex-end;
                        height: 4em;
                    }
                    .sound {
                        font-size: 2em;
                        font-weight: 500;
                        font-style: italic;
                    }
                `}
                </style>
            </div>
        )
    }
}

export default Brand