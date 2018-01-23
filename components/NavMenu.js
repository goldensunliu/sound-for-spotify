import React, {Component} from 'react'
import { MenuStyles } from '../global-styles'
import MenuSvg from '../images/menu.svg'
import Link from 'next/link'
import { bubble as Menu } from 'react-burger-menu'

// TODO refactor these into a HOC
const NavMenu = ({ isOpen }) => {
    return (
        <Menu isOpen={isOpen} customBurgerIcon={<MenuSvg/>} width={ 200 } styles={MenuStyles}>
            <div className="menu-item"><Link href="/graphiql"><a>Spotify GraphQL Explorer</a></Link></div>
            <div className="menu-item"><Link href="/recently-played"><a>Recently Played Tracks</a></Link></div>
            <div className="menu-item"><Link href="/featured-playlists"><a>Browser Featured Playlists</a></Link></div>
           { /*language=CSS*/ }
            <style jsx>{`
                .menu-item, a {
                    color: white;
                    font-size: 18px;
                    font-weight: bold;
                    padding: 15px 0;
                    text-decoration: none;
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

// TODO use Spotify branding on powerd by disclaimer
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
                    padding: .5em 1em 1em;
                    flex-wrap: wrap;
                    font-size: .9em;
                }
                .menu-item {
                    min-width: 10em;
                }
            `}</style>
        </div>
    )
}

export default NavMenu