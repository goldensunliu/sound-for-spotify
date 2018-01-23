import React from 'react'
import NextHead from 'next/head'
import NavMenu, { Footer } from './NavMenu'
import GlobalStyles from '../global-styles'

const Layout = ({name, children}) =>{
    return(
        <div>
            <NextHead>
                <title>{name}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" type="text/css"/>
            </NextHead>
            <NavMenu/>
            <div className="body">
                {children}
                <Footer/>
            </div>
            <style jsx global>{GlobalStyles}</style>
            { /*language=CSS*/ }
            <style jsx>{`
                .body {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-between;
                }
            `}</style>
        </div>
    )
}

export default Layout