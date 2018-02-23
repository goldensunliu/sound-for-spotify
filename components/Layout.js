import React from 'react'
import NextHead from 'next/head'
import NavMenu, { Footer } from './NavMenu'
import GlobalStyles from '../global-styles'
import Router from 'next/router'
import { ToastContainer } from 'react-toastify';

Router.onRouteChangeStart = () => {
    document.body.classList.add('loading')
}

Router.onRouteChangeComplete = url => {
    document.body.classList.remove('loading')
}

const Layout = ({name, children, hideMenu, header}) =>{
    return(
        <div>
            <NextHead>
                <title>{name}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta property="og:title"              content="Discover Your Sound With Musical Intelligence Data from Spotify" />
                <meta property="og:type"               content="website" />
                <meta property="og:description"        content="Find your sound preferences using intelligence data about artists, genres, and tracks straight from Spotify" />
                <meta property="og:image"              content="https://soundforspotify.com/static/og-image.png" />
                <link rel="icon" type="image/png" href="/static/volume-bars.png"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" type="text/css"/>
            </NextHead>
            { !hideMenu && <NavMenu/> }
            <ToastContainer/>
            <div className="root">
                <div className="body">
                    { header && <div className="header">{header}</div> }
                    {children}
                </div>
                <Footer/>
            </div>
            <style jsx global>{GlobalStyles}</style>
            { /*language=CSS*/ }
            <style jsx>{`
                .root {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-between;
                }
                .header {
                    font-size: 2em;
                    margin-bottom: .5em;
                    margin-top: .5em;
                    margin-left: .4em;
                }
                .body {
                    display: flex;
                    flex: 1;
                    width: 100vw;
                    flex-direction: column;
                }
            `}</style>
        </div>
    )
}

export default Layout