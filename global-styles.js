import css from 'styled-jsx/css'
import { backGroundOrange, backGroundGrey, backGroundBlue } from './utils/colors'
import Color from 'color'

const backGroundMenuColor = backGroundBlue;
export const MenuStyles = {
    bmBurgerButton: {
        position: 'fixed',
        width: '40px',
        height: '40px',
        right: 10,
        top: 10
    },
    bmBurgerBars: {
        background: backGroundMenuColor
    },
    bmCrossButton: {
        height: '24px',
        width: '24px'
    },
    bmCross: {
        background: 'white'
    },
    bmMenu: {
        background: backGroundMenuColor,
        padding: '1.5em 0.5em 0',
    },
    bmMorphShape: {
        fill: backGroundMenuColor
    },
    bmItemList: {
        height: 'initial',
        color: '#b8b7ad',
        padding: '0.8em'
    },
    bmOverlay: {
        background: 'rgba(0, 0, 0, 0.3)'
    }
}

{ /*language=CSS*/ }
const styles = css`
body {
    margin: 0;
    font-size: 13px;
}

.bm-burger-button * {
    fill: ${backGroundMenuColor}
}
@media (min-width: 600px) {
    body { font-size: 15px; }
}
a {
    color: inherit;
    text-decoration: none;
}
.pill {
    background-color: ${backGroundOrange};
    color: white;
    font-weight: bold;
    font-size: .9em;
    border-radius: 4px;
    margin: 2px;
    text-transform: capitalize;
    padding: 5px;
}
.header {
    font-size: 1.8em;
    font-weight: bold;
    line-height: 1.5em;
}
.truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
body {
    font-family: "Roboto","Helvetica","Arial",sans-serif;
}
.Popover {
    z-index: 2000;
}
.Popover-body {
    display: inline-flex;
    flex-direction: column;
    padding: .5rem 1rem;
    background: white;
    border-radius: 0.3rem;
    opacity: .95;
    box-shadow: rgba(0, 0, 0, 0.12) 0 1px 6px, rgba(0, 0, 0, 0.12) 0 1px 4px;
    font-size: 14px;
}

.Popover-tipShape {
    fill: ${backGroundBlue};
}

.Popover-white .Popover-tipShape {
    fill: #00bcd4;
}

.Popover-white .Popover-body {
    background: white;
}

body {
  opacity: 1;
  transition: filter 1s ease-in-out;
}
body.loading {
    filter: blur(20px);
}
`;

export default styles