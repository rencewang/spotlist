import React, { useEffect, useState, useRef } from 'react'
import { Icon } from '@iconify/react'
import bxPlay from '@iconify/icons-bx/bx-play'

import Instruction from "./instruction"
import Results from './results'
import './App.scss'

const axios = require('axios')

function App() {

  const [userInput, setInput] = useState('')
  const [playlistID, setID] = useState('')  
  const [playlistName, setName] = useState('')
  const [playlistOwner, setOwner] = useState('')
  const [playlistTracks, setTrack] = useState([])

  const copied = useRef(null)
  const tryagain = useRef(null)

  // Parse input string for playlist ID
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
      ShowAlert(tryagain)
    }
  }

  // For "Copied" alert
  const ShowAlert = (ref) => {
    ref.current.style.opacity = 1
    ref.current.style.display = "block"
    setTimeout(() => ref.current.style.opacity = 0, 200)
    setTimeout(() => ref.current.style.display = "none", 300)
  }

  // For random color
  const hue = 1 + Math.random() * (360 - 1)
  const [backgroundColor] = useState(`hsl(${hue}, 30%, 80%)`)
  const [textColor] = useState(`hsl(${hue}, 100%, 20%)`)
  document.body.style.backgroundColor = backgroundColor
  document.body.style.color = textColor

  return (
    <main className="App">
      
      <div className="alert-message" ref={copied}>Copied!</div>
      <div className="alert-message" ref={tryagain}>Try again with a valid playlist ID or link</div>

      <header>
        <h2><a href="/">Spotlist</a></h2>
        <form onSubmit={GetPlaylist} autoComplete="off">
          <input type="text" id="playlist" name="playlist" value={userInput} placeholder="Enter Playlist ID or Link" onChange={event => setInput(event.target.value)} required/>
          <button type="submit"><Icon icon={bxPlay} width="100%" /></button>
        </form>
      </header>

      <div id="content">
        <Results name={playlistName} owner={playlistOwner} tracks={playlistTracks} ShowAlert={ShowAlert} copiedRef={copied} />
        <Instruction />
      </div>
    </main>
  )
}

export default App
