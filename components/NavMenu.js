import React, {Component} from 'react'
import { MenuStyles } from '../global-styles'
import MenuSvg from '../images/menu.svg'
import Link from 'next/link'
import { bubble as Menu } from 'react-burger-menu'

const NavMenu = ({ isOpen }) => {
    return (
        <Menu isOpen={isOpen} customBurgerIcon={<MenuSvg/>} width={ 200 } styles={MenuStyles}>
            <a className="menu-item" title="Sitian Liu" target="_blank" href="https://www.sitianliu.com/">Code & Design By Sitian Liu</a>
            <div className="menu-item">Icons from <a title="Flaticon" href="http://www.flaticon.com">www.flaticon.com</a></div>
            <div className="menu-item"><Link href="/graphiql"><a>Spotify GraphQL Explorer</a></Link></div>
            <div className="menu-item"><Link href="/RecentlyPlayed"><a>Recently Played Tracks</a></Link></div>
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
            `}</style>
        </Menu>
    )
}

export default NavMenu