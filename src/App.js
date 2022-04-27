import React, { useEffect, useState } from 'react'

import { Icon } from '@iconify/react'
import bxCopy from '@iconify/icons-bx/bx-copy'
import bxPlay from '@iconify/icons-bx/bx-play'

import Instruction from "./instruction"
import './App.scss'

const axios = require('axios')

function App() {

  // Parse input string for playlist ID
  const [userInput, setInput] = useState('')
  const [playlistID, setID] = useState('')

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

  // Retrieve access token through Netlify function
  const GetAccessToken = async () => {
    try {
      const response = await fetch(`/.netlify/functions/token-hider`)
      const data = await response.json()
      return data.access_token
    } catch (err) {
      console.log(err)
    }
  }

  // Playlist information states
  const [playlistName, setName] = useState('')
  const [playlistOwner, setOwner] = useState('')
  const [playlistTracks, setTrack] = useState([])

  // Style states
  const [tryAgainDisplay, setTryAgainDisplay] = useState("none")
  const [tryAgainOpacity, setTryAgainOpacity] = useState(100)

  // Making API calls to get playlist information
  const GetPlaylist = async (event) => {
    event.preventDefault()
    setTrack([])

    const token = await GetAccessToken()
    const callURL = `https://api.spotify.com/v1/playlists/${playlistID}`

    try {
      const response = await axios.get(callURL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.data
      
      // set the playlist name and creator
      setName(data.name) 
      setOwner(data.owner.display_name) 

      document.getElementById("results").style.display = "block"
      document.getElementById("instruction").style.display = "none"

      // set tracklist while taking care of pagination
      for (let i = 0; i < Math.ceil(response.data.tracks.total / 100) + 1; i++) {
        const newURL = `https://api.spotify.com/v1/playlists/${playlistID}/tracks?offset=${i*100}&limit=100`

        try {
          const page = await axios.get(newURL, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          const data = await page.data

          setTrack(playlistTracks => [...playlistTracks, ...data.items])
        } catch (error) {
          // error occurred in pagination calls
          console.log(error)
        }
      }

    } catch (error) {
      // prompt error message
      console.log("Try Again.", error)
      setTryAgainDisplay("block")
      setTryAgainOpacity(100)
      setTimeout(() => setTryAgainOpacity(0), 250)
      setTimeout(() => setTryAgainDisplay("none"), 500)
    }
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

      <header>
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

      <footer>
        <div>Built by Lawrence</div>
      </footer>

    </main>
  )
}

export default App
