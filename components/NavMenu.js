import React, {Component} from 'react'
import { MenuStyles } from '../global-styles'
import MenuSvg from '../images/menu.svg'
import Link from 'next/link'
import { bubble as Menu } from 'react-burger-menu'
import Cookies from 'js-cookie'
import Router from 'next/router'
import { backGroundGrey } from "../utils/colors";

function logOut() {
    Cookies.remove('spotify-token');
    Router.push(Router.asPath)
}
const NavMenu = ({ isOpen }) => {
    return (
        <Menu isOpen={isOpen} customBurgerIcon={<MenuSvg/>} width={ 200 } styles={MenuStyles} right>
            <div className="menu-item"><Link prefetch href="/my-top-artists"><a>My Top Artists</a></Link></div>
            <div className="menu-item"><Link prefetch href="/my-top-tracks"><a>My Top Tracks</a></Link></div>
            <div className="menu-item"><Link prefetch href="/recently-played"><a>Play History</a></Link></div>
            <div className="menu-item"><Link prefetch href="/featured-playlists"><a>Featured Playlists</a></Link></div>
            <div className="menu-item"><Link prefetch href="/categories"><a>Categories</a></Link></div>
            <div className="menu-item"><div onClick={logOut}>Log Out</div></div>
           { /*language=CSS*/ }
            <style jsx>{`
                .menu-item, a {
                    color: white;
                    font-size: 18px;
                    font-weight: bold;
                    padding: 15px 0;
                    text-decoration: none;
                    cursor: pointer;
                }
                .menu-item:not(:last-child) {
                    border-bottom: 1px solid;
                }
                .me {

                }
            `}</style>
        </Menu>
    )
}

export const Footer = () => {
    return (
        <div className="root">
            <div className="menu-item">Icons from <a title="Flaticon" href="http://www.flaticon.com">Flaticon</a></div>
            <div className="menu-item">Data ⚡ by <a title="Spotify" href="https://developer.spotify.com/web-api/">Spotify</a></div>
            <a className="menu-item me" title="Sitian Liu" target="_blank" href="https://www.sitianliu.com/">Code & Design By Sitian Liu</a>
            { /*language=CSS*/ }
            <style jsx>{`
                .root {
                    display: flex;
                    align-items: center;
                    justify-content: space-evenly;
                    margin: .5em 1em 1em;
                    flex-wrap: wrap;
                    font-size: .9em;
                    width: 100vw;
                }
                .menu-item {
                    min-width: 10em;
                    color: ${backGroundGrey};
                }
            `}</style>
        </div>
    )
}

export default NavMenu