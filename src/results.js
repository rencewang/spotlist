import React from 'react'
import { Icon } from '@iconify/react'
import bxCopy from '@iconify/icons-bx/bx-copy'
import circleChevronUpFill from '@iconify/icons-akar-icons/circle-chevron-up-fill'

import './App.scss'

const Results = (props) => {
    const {name, owner, tracks, ShowAlert, copiedRef} = props

    const TracksToCSV = (tracks) => {
        let csvTracks = tracks.map(row => 
            '"' + row.track.name + '","' + row.track.artists.map(artist => artist.name).join(', ') + '","' + row.track.album.name + '",' + row.added_at
        ).join('\r\n')
        return ("track_name, artists, album_name, added_at \r\n" + csvTracks)
    }

    const DownloadCSV = (event) => {
        event.preventDefault()
        // Create a blob
        var blob = new Blob([TracksToCSV(tracks)], { type: 'text/csv;charset=utf-8;' })
        var url = URL.createObjectURL(blob)
        // Create a link to download it
        var pom = document.createElement('a')
        pom.href = url
        pom.setAttribute('download', 'spotlist-export.csv')
        pom.click()
    }

    // For copy to clipboard button
    const CopyToClipboard = (element) => {
        var range = document.createRange()
        range.selectNode(document.getElementById( element ))
        window.getSelection().removeAllRanges()
        window.getSelection().addRange(range)
        document.execCommand("copy")
        window.getSelection().removeAllRanges()
    }

    // For scroll up button
    const ScrollUp = (e) => {
        e.preventDefault()
        document.querySelector("#content").scrollTo( { left: 0, top: 0, behavior: 'smooth' } )
    }

    console.log(tracks)

    return (
        <section className="results" id="results">

            <div id='resultsheader'>
                <h1 id="playlistName"><a href={name.link} target="_blank" rel="noopener noreferrer">{name.name}</a> by <a href={owner.link} target="_blank" rel="noopener noreferrer">{owner.owner}</a></h1>
                <button onClick={(e) => DownloadCSV(e)} id='download'>Download as CSV</button>
            </div>

            <table className="tracklisting" id="tracktable">
                <thead id='trackhead'>
                    <tr>
                        <th>#</th>
                        <th>Track</th>
                        <th>Artist</th>
                        <th>Album</th>
                        <th>Added on</th>
                    </tr>
                </thead>
            
                <tbody>
                    {tracks ? tracks.map((track, index) => ( 
                        <tr key={index}>
                            <td label="#">{index+1}</td>

                            <td label="Track">
                                <div className="justify">
                                    <div id={`${index}trackname`}><a href={track.track ? track.track.external_urls.spotify : null} target="_blank" rel="noopener noreferrer"> {track.track ? track.track.name : null}</a></div>
                                    <button onClick={() => {CopyToClipboard(`${index}trackname`); ShowAlert(copiedRef)}}>
                                        <Icon icon={bxCopy} width="20px" />
                                    </button>
                                </div>
                            </td>

                            <td label="Artist">
                                <div className="justify">
                                    <div id={`${index}artistname`}>
                                        {track.track ? track.track.artists.map((artist, index) => (
                                        index === 0 ? 
                                        <span key={index}><a href={track.track.artists[index].external_urls.spotify || null} target="_blank" rel="noopener noreferrer">{artist.name}</a></span> : 
                                        <span key={index}>, <a href={track.track.artists[index].external_urls.spotify || null} target="_blank" rel="noopener noreferrer">{artist.name}</a></span>
                                        )) : null}
                                    </div>
                                    <button onClick={() => {CopyToClipboard(`${index}artistname`); ShowAlert(copiedRef)}}>
                                        <Icon icon={bxCopy} width="20px" />
                                    </button>
                                </div>
                            </td>

                            <td label="Album">
                                <div className="justify">
                                    <div id={`${index}albumname`}><a href={track.track ? track.track.album.external_urls.spotify : null} target="_blank" rel="noopener noreferrer">{track.track ? track.track.album.name: null}</a></div>
                                    <button onClick={() => {CopyToClipboard(`${index}albumname`); ShowAlert(copiedRef)}}>
                                        <Icon icon={bxCopy} width="20px" />
                                    </button>
                                </div>
                            </td>

                            <td label="Added on">{track.added_at.substring(5,7)}/{track.added_at.substring(8,10)}/{track.added_at.substring(0,4)}</td>
                        </tr> : null
                    )) : null}
                </tbody>
            </table>

            <button type='button' className="gotop" onClick={(e) => ScrollUp(e)}>
                <Icon icon={circleChevronUpFill} width="50px" />
            </button>
        </section>
    )
}

export default Results