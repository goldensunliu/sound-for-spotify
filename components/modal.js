import React, { Component } from 'react';


export default class Modal extends Component {
    onClick = (event) => {
        if (this.content.contains(event.target) || this.content === event.target) {
            return
        }
        this.props.onClose();
    }
    render() {
        return (
            <div className="root" onClick={this.onClick}>
                <div className="screen"/>
                <div className="content" ref={(content) => { this.content = content; }}>
                    {this.props.children}
                </div>
                { /*language=CSS*/ }
                <style jsx>{`
                    .root {
                        position: fixed;
                        top: 0;
                        left: 0;
                        height: 100vh;
                        width: 100vw;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 1000;
                    }
                    .screen {
                        position: fixed;
                        height: 100%;
                        width: 100%;
                        top: 0;
                        left: 0;
                        opacity: 1;
                        background-color: rgba(0, 0, 0, 0.54);
                        z-index: 1100;
                    }
                    .content {
                        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
                        z-index: 1200;
                        background-color: white;
                    }
                `}
                </style>
            </div>
        )
    }
}