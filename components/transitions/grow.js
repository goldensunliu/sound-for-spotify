import React from 'react';
import Transition from 'react-transition-group/Transition';
const duration = 200;

const defaultStyle = {
    transition: `all ${duration}ms ease-in-out`,
    maxHeight: 0,
    opacity: 0
}

const transitionStyles = {
    entering: () => { return { maxHeight: 0.01, opacity: 0.01 } },
    entered:  (maxHeight) => { return { maxHeight, opacity: 1 } }
};

const Grow = ({ in: inProp , children, style, appear, maxHeight }) => (
    <Transition in={inProp} timeout={duration} unmountOnExit={true} appear={appear}>
        {(state) => {
            return (
                <div style={{
                    ...defaultStyle,
                    ...(transitionStyles[state] && transitionStyles[state](maxHeight)),
                    ...style
                }}>
                    {children}
                </div>
            )
        }}
    </Transition>
)

export default Grow

