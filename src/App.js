import React, { useEffect, useState } from 'react'

import { Icon } from '@iconify/react'
import bxCopy from '@iconify/icons-bx/bx-copy'
import bxPlay from '@iconify/icons-bx/bx-play'
import './App.scss'

import Instruction from "./instruction"

function App() {

  // Parse input string for playlist ID
  const [userInput, setInput] = useState('')
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

  const [playlistID, setID] = useState('')
  const [playlistName, setName] = useState('')
  const [playlistOwner, setOwner] = useState('')
  const [playlistTracks, setTrack] = useState([])
  const [tryAgainDisplay, setTryAgainDisplay] = useState("none")
  const [tryAgainOpacity, setTryAgainOpacity] = useState(100)
  const [playlistCurrentLinkState, setPlaylistLink] = useState('')
  const [sessionToken, setToken] = useState('')
  const [playlistPage, setPage] = useState(1)
  const GetPlaylist = event => {
    event.preventDefault()

    // Spotify API call
    let request = require('request')
    const client_id = '3db56f3a8f864d0f82169d8d74dea551'
    const client_secret = '2e116c197d6e4f1da189f47254d99afb'
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
      form: { grant_type: 'client_credentials' },
      json: true
    }

    request.post(authOptions, function(error, response, body) {

      if (!error && response.statusCode === 200) {

        setToken(body.access_token)
        let token = body.access_token
        let options = {
          url: 'https://api.spotify.com/v1/playlists/' + playlistID,
          headers: {
            'Authorization': 'Bearer ' + token
          },
          json: true
        }
        console.log(body)

        request.get(options, function(error, response, body) {

          console.log(body)
          let playlistCurrentLink = 'https://api.spotify.com/v1/playlists/' + playlistID
          console.log(playlistCurrentLink)
          console.log(playlistCurrentLinkState)
          setPage(3)
          console.log(playlistPage)

          if (response.statusCode === 404) {

            // prompt error message
            console.log("Try Again.")
            setTryAgainDisplay("block")
            setTryAgainOpacity(100)
            setTimeout(() => setTryAgainOpacity(0), 250)
            setTimeout(() => setTryAgainDisplay("none"), 500)

          } else {

            // display the list of results
            document.getElementById("results").style.display = "block"
            document.getElementById("instruction").style.display = "none"

            // set the playlist name and creator
            setName(body.name) 
            setOwner(body.owner.display_name) 

            // if (body.name !== undefined) { // set the playlist name
            //   setName(body.name) 
            // }
            // if (body.owner !== undefined) { // set the playlist owner's name
            //   setOwner(body.owner.display_name) 
            // }

            // if (body.tracks !== undefined) {
            //   console.log(body.tracks)

                let trackCalls = Math.ceil(body.tracks.total / 100)
                console.log(trackCalls)
                // setTrack(body.tracks.items)

                for (let i = 0; i < trackCalls; i++) {

                  let newOptions = {
                    url: 'https://api.spotify.com/v1/playlists/' + playlistID + '/tracks?offset=' + i*100 + '&limit=100',
                    headers: {
                      'Authorization': 'Bearer ' + token
                    },
                    json: true
                  }

                  request.get(newOptions, function(error, response, body) {
                    
                    console.log(body)
                    setTrack(playlistTracks => [...playlistTracks, ...body.items])

                  })
                }

              // } else {
              //   // if there are no next items, set Track state
              //   setTrack(body.tracks.items)
              // }
              
              console.log(playlistTracks)
              // playlistArray = body.tracks.items
              // playlistArray = playlistArray.concat(body.tracks.items)
              // setTrack(playlistArray)
              // console.log(body.tracks.items)
              // console.log(playlistArray)
            // }
          }
        })
      }
    })
    // console.log(playlistTracks)
    // console.log(playlistID)
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
    return `hsl(${hue}, 30%, 80%)`
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
      
      <Instruction />

    </main>
  )
}

export default App
