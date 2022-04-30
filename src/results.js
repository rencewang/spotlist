import React from 'react'
import { Icon } from '@iconify/react'
import bxCopy from '@iconify/icons-bx/bx-copy'

import './App.scss'

function Results( props ) {
    const {name, owner, tracks, ShowAlert, copiedRef} = props

    const TracksToCSV = (tracks) => {
        let csvTracks = tracks.map(row => 
            row.track.name + ',"' + row.track.artists.map(artist => artist.name).join(', ') + '",' + row.track.album.name + ',' + row.added_at
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

    return (
        <section className="results" id="results">

            <button onClick={(e) => DownloadCSV(e)} id='download'>
                download
            </button>

            <h3 id="playlistName">{name}<small> {'\u00A0'} By {'\u00A0'} </small>{owner}</h3>

            <table className="tracklisting" id="tracktable">
            <thead>
            <tr>
                <th>Track</th>
                <th>Artist</th>
                <th>Album</th>
                <th>Added on</th>
            </tr>
            </thead>
            <tbody>
            {tracks ? tracks.map((track, index) => (
                <tr key={index}>
                <td>
                    <div className="justify">
                    <div id={`${index}trackname`}><a href={track.track.external_urls.spotify} target="_blank" rel="noopener noreferrer"> {index} {track.track.name}</a></div>
                    <button onClick={() => {CopyToClipboard(`${index}trackname`); ShowAlert(copiedRef)}}><Icon icon={bxCopy} width="20px" /></button>
                    </div>
                </td>
                <td>
                    <div className="justify">
                    <div id={`${index}artistname`}>
                        {track.track.artists.map((artist, index) => (
                        index === 0 ? 
                        <span key={index}><a href={track.track.artists[index].external_urls.spotify} target="_blank" rel="noopener noreferrer">{artist.name}</a></span> : 
                        <span key={index}>, <a href={track.track.artists[index].external_urls.spotify} target="_blank" rel="noopener noreferrer">{artist.name}</a></span>
                        ))}
                    </div>
                    <button onClick={() => {CopyToClipboard(`${index}artistname`); ShowAlert(copiedRef)}}><Icon icon={bxCopy} width="20px" /></button>
                    </div>
                </td>
                <td>
                    <div className="justify">
                    <div id={`${index}albumname`}><a href={track.track.album.external_urls.spotify} target="_blank" rel="noopener noreferrer">{track.track.album.name}</a></div>
                    <button onClick={() => {CopyToClipboard(`${index}albumname`); ShowAlert(copiedRef)}}><Icon icon={bxCopy} width="20px" /></button>
                    </div>
                </td>
                <td>{track.added_at.substring(5,7)}/{track.added_at.substring(8,10)}/{track.added_at.substring(0,4)}</td>
                </tr>
            )) : null}
            </tbody>
            </table>
        </section>
    )
}

export default Results