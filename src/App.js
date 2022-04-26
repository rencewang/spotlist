import React, { useEffect, useState } from 'react'

import { Icon } from '@iconify/react'
import bxCopy from '@iconify/icons-bx/bx-copy'
import bxPlay from '@iconify/icons-bx/bx-play'

import Instruction from "./instruction"
import './App.scss'

function App() {

  // Parse input string for playlist ID
  const [userInput, setInput] = useState('')
  useEffect(() => {
      let slicedURL = userInput
      if (userInput.includes("/playlist/")) {
        slicedURL = userInput.split("/playlist/")[1]
      }
      if (slicedURL.includes("?")) {
        slicedURL = slicedURL.substring(0, slicedURL.indexOf("?"))
      }
      setID(slicedURL)
  }, [userInput])

  // Making API calls to get playlist information
  const [playlistID, setID] = useState('')
  const [playlistName, setName] = useState('')
  const [playlistOwner, setOwner] = useState('')
  const [playlistTracks, setTrack] = useState([])
  const [tryAgainDisplay, setTryAgainDisplay] = useState("none")
  const [tryAgainOpacity, setTryAgainOpacity] = useState(100)
  const client_id = process.env.CLINET_ID
  const client_secret = process.env.CLIENT_SECRET
  console.log(client_id)

  const GetPlaylist = event => {
    event.preventDefault()
    setTrack([])

    let request = require('request')
    
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
      form: { grant_type: 'client_credentials' },
      json: true
    }

    request.post(authOptions, function(error, response, body) {

      if (!error && response.statusCode === 200) {
        // set the initial options for the first call
        let token = body.access_token
        let options = {
          url: 'https://api.spotify.com/v1/playlists/' + playlistID,
          headers: {
            'Authorization': 'Bearer ' + token
          },
          json: true
        }

        request.get(options, function(error, response, body) {
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

            // for loop to grab paginated track list by making multiple calls
            for (let i = 0; i < Math.ceil(body.tracks.total / 100)+1; i++) {

              let newOptions = {
                url: 'https://api.spotify.com/v1/playlists/' + playlistID + '/tracks?offset=' + i*100 + '&limit=100',
                headers: {
                  'Authorization': 'Bearer ' + token
                },
                json: true
              }

              request.get(newOptions, function(error, response, body) {
                // console.log(body)
                // console.log(response)
                setTrack(playlistTracks => [...playlistTracks, ...body.items])
              })
            }

          }
        })

      }
    })
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
                  <div id={`${index}trackname`}><a href={track.track.external_urls.spotify} target="_blank" rel="noopener noreferrer"> {index} {track.track.name}</a></div>
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
