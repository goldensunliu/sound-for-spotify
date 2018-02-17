import React, {Component} from 'react'
import Color from 'color'
import Link from 'next/link'
import {backGroundOrange} from "../utils/colors";

const GenresRow = ({genres}) => {
    return (
        <div className="genre-row">
            {genres.map((g, i) => (
                <Link href={`/genre?id=${encodeURIComponent(g)}`}>
                    <div className="pill" key={i}>
                        {g}
                    </div>
                </Link>
            ))}
            {/*language=CSS*/}
            <style jsx>{`
                .genre-row {
                    display: flex;
                    flex-wrap: wrap;
                }
                .pill {
                    cursor: pointer;
                    flex-shrink: 0;
                    display: flex;
                    font-size: 1.1em;
                    margin: .25em;
                    padding: .2em .6em;
                    transition: box-shadow 0.3s ease-in-out;
                    box-shadow: 0 1.5px 3px 0 ${Color(backGroundOrange).darken(.5).hsl().string()};
                }
                .pill:hover {
                    box-shadow: 0 4px 8px 0 ${Color(backGroundOrange).darken(.5).hsl().string()};
                }
            `}</style>
        </div>
    )
}

export default GenresRow