import React, {Component} from 'react'
import Popover from 'react-popover'

import { AttributeConfig } from '../utils/AttributeConfig'
import { backGroundGrey } from "../utils/colors";

export default class WithExplainationPopover extends React.Component {
    state = { open: false }
    handleClose = () => {
        this.setState({open: false});
    };
    toggleOpen = (event) => {
        // This prevents ghost click.
        event.preventDefault();
        this.setState({open: !this.state.open});
    }
    render() {
        const { label, explanation } = AttributeConfig[this.props.attributeKey];
        const body = (
            <div>
                <div className="headline">{label}</div>
                <div className="content">{explanation}</div>
                {/*language=CSS*/}
                <style jsx>{`
                    .headline {
                        font-size: 1.5em;
                        line-height: 32px;
                    }
                    .content {
                        text-align: justify;
                    }
                `}</style>
            </div>
        )
        return (
            <Popover style={{ width: '90vw', maxWidth: '40em' }} preferPlace="below" body={body} onOuterAction={this.handleClose}
                     isOpen={this.state.open} refreshIntervalMs={300}>
                <div onClick={this.toggleOpen}>
                    {this.props.render(this.state)}
                </div>
            </Popover>
        )
    }
}