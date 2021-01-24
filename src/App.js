import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import bxCopy from '@iconify/icons-bx/bx-copy'
import bxPlay from '@iconify/icons-bx/bx-play'
import ReactGA from 'react-ga';

import './App.scss'

function App() {

  // Google Analytics
  ReactGA.initialize('G-C0CDR2SDRS');
  ReactGA.pageview(window.location.pathname + window.location.search);

  // Getting playlist from Spotify API
  const [userInput, setInput] = useState('')
  const [playlistID, setID] = useState('')
  const [playlistName, setName] = useState('')
  const [playlistOwner, setOwner] = useState('')
  const [playlistTracks, setTrack] = useState([])
  const [tryAgainDisplay, setTryAgainDisplay] = useState("none")
  const [tryAgainOpacity, setTryAgainOpacity] = useState(100)

  useEffect(
    () => {
      if (userInput.match("https://open.spotify.com/playlist/")) {
        setID(userInput.slice(34))
      } else if (userInput.match("open.spotify.com/playlist/")) {
        setID(userInput.slice(26))
      } else {
      setID(userInput)
      }
    },
    [userInput],
  )

  const GetPlaylist = event => {
    event.preventDefault()
    let request = require('request')
    const client_id = '3db56f3a8f864d0f82169d8d74dea551'
    const client_secret = '95dd0815b84541ac86fe502139f3f91d'
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      form: {
        grant_type: 'client_credentials'
      },
      json: true
    }
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        let token = body.access_token
        let options = {
          url: 'https://api.spotify.com/v1/playlists/' + playlistID,
          headers: {
            'Authorization': 'Bearer ' + token
          },
          json: true
        }
        request.get(options, function(error, response, body) {
          console.log(response)
          if (typeof body === 'object' && body !== null) {
            if (body.name !== undefined) {
              setName(body.name)
              document.getElementById("results").style.display = "block"
              document.getElementById("instruction").style.display = "none"
            } else {
              console.log("Try Again.")
              setTryAgainDisplay("block")
              setTryAgainOpacity(100)
              setTimeout(() => setTryAgainOpacity(0), 250)
              setTimeout(() => setTryAgainDisplay("none"), 500)
            }
            if (body.owner !== undefined) {setOwner(body.owner.display_name)}
            if (body.tracks !== undefined) {setTrack(body.tracks.items)}
          }
          if (response.statusCode === 404) {
            console.log("Try Again.")
            setTryAgainDisplay("block")
            setTryAgainOpacity(100)
            setTimeout(() => setTryAgainOpacity(0), 250)
            setTimeout(() => setTryAgainDisplay("none"), 500)
          }
        })
      }
    })
    console.log(playlistTracks)
    console.log(playlistID)
  }

  // For copy to clipboard button
  function CopyToClipboard(element) {
    var range = document.createRange()
    range.selectNode(document.getElementById( element ))
    window.getSelection().removeAllRanges()
    window.getSelection().addRange(range)
    document.execCommand("copy")
    window.getSelection().removeAllRanges()
  }

  // For "Copied" alert
  const [copiedDisplay, setCopiedDisplay] = useState("none")
  const [copiedOpacity, setCopiedOpacity] = useState(0)
  function ShowCopied() {
    console.log("Copied!")
    setCopiedDisplay("block")
    setCopiedOpacity(100)
    setTimeout(() => setCopiedOpacity(0), 500)
    setTimeout(() => setCopiedDisplay("none"), 1000)
  }

  // For random color background
  function RandomBackgroundColor() {
    var hue = 1 + Math.random() * (360 - 1)
    return `hsl(${hue}, 65%, 80%)`
  }
  const [randomBackgroundColor] = useState(RandomBackgroundColor())
  document.body.style.backgroundColor = randomBackgroundColor

  return (
    <main className="App">

      <div className="alert-message" style={{display: copiedDisplay, opacity: copiedOpacity}} id="copied">
          Copied!
      </div>
      <div className="alert-message" style={{display: tryAgainDisplay, opacity: tryAgainOpacity}} id="try-again"> 
        Try again with a valid playlist ID or link
      </div>

      <header className="header">
        <form onSubmit={GetPlaylist} autoComplete="off" className="trackIDform">
          <input type="text" id="playlist" name="playlist" value={userInput} placeholder="Enter Playlist ID or Link" onChange={event => setInput(event.target.value)} required/>
          <button type="submit"><Icon icon={bxPlay} width="100%" /></button>
        </form>
        <div><a href="/">Spotlist</a></div>
      </header>

      <div className="results" id="results">
        <h3 id="playlistName">{playlistName}<small> {'\u00A0'} By {'\u00A0'} </small>{playlistOwner}</h3>
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
          {playlistTracks.map((track, index) => (
            <tr key={index}>
              <td>
                <div className="justify">
                  <div id={`${index}trackname`}><a href={track.track.external_urls.spotify} target="_blank" rel="noopener noreferrer">{track.track.name}</a></div>
                  <button onClick={() => {CopyToClipboard(`${index}trackname`); ShowCopied()}}><Icon icon={bxCopy} width="20px" /></button>
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
                  <button onClick={() => {CopyToClipboard(`${index}artistname`); ShowCopied()}}><Icon icon={bxCopy} width="20px" /></button>
                </div>
              </td>
              <td>
                <div className="justify">
                  <div id={`${index}albumname`}><a href={track.track.album.external_urls.spotify} target="_blank" rel="noopener noreferrer">{track.track.album.name}</a></div>
                  <button onClick={() => {CopyToClipboard(`${index}albumname`); ShowCopied()}}><Icon icon={bxCopy} width="20px" /></button>
                </div>
              </td>
              <td>{track.added_at.substring(5,7)}/{track.added_at.substring(8,10)}/{track.added_at.substring(0,4)}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>

      <div id="instruction">
        <section id="instruction-left">
          <div style={{fontSize: "40px", marginBottom: "5px", fontWeight: "700"}}>Access any public or private Spotify playlist using its playlist ID</div>
          <div>For a copy-and-pastable list of track, artist, and album names.</div>
          <div style={{fontSize: "30px", fontWeight: "700", marginTop: "30px", marginBottom: "5px", fontStyle: "italic"}}>Something to get started with?</div>
          <table>
            <tbody>
              <tr>
                <td>Today's Top Hits: {'\u00A0'} </td>
                <td>37i9dQZF1DXcBWIGoYBM5M</td>
              </tr>
              <tr>
                <td>New Music Friday: {'\u00A0'} </td>
                <td>37i9dQZF1DX4JAvHpjipBk</td>
              </tr>
              <tr>
                <td>All Out 10s: {'\u00A0'} </td>
                <td>37i9dQZF1DX5Ejj0EkURtP</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section id="instruction-right" style={{fontSize: "15px"}}>
          <div style={{fontSize: "20px", marginBottom: "10px"}}>Spotlist is a <a href="https://github.com/law-wang/spotlist">project</a> by <a href="https://www.rence.la/">Lawrence</a> using React and Spotify API.</div>
          <div><b>2020.08.02:</b> initial launch.</div>
          <div><b>2020.08.16:</b> neumorphic style update.</div>
          <div><b>2021.01.22:</b> table style overhaul.</div>
          <div><b>2021.01.23:</b> home page style overhaul; random background color; playlist content links to Spotify; search with playlist link in addition to ID. </div>
        </section>
      </div>


    </main>
  )
}

export default App
