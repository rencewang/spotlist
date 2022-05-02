import React, { useEffect, useState, useRef } from 'react'
import { Icon } from '@iconify/react'
import playFill from '@iconify/icons-bi/play-fill'

import Instruction from "./instruction"
import Results from './results'
import './App.scss'

const axios = require('axios')

const App = () => {

  const [userInput, setInput] = useState('')
  const [playlistID, setID] = useState('')  
  const [playlistName, setName] = useState({})
  const [playlistOwner, setOwner] = useState({})
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
  const GetPlaylist = async (event, ID) => {
    event.preventDefault()
    setTrack([])

    const token = await GetAccessToken()
    const callURL = `https://api.spotify.com/v1/playlists/${ID}`

    try {
      const response = await axios.get(callURL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.data
      
      // set the playlist name and creator
      setName({name: data.name, link: data.external_urls.spotify}) 
      setOwner({owner: data.owner.display_name, link: data.owner.external_urls.spotify}) 

      document.getElementById("results").style.display = "block"
      document.getElementById("trackhead").style.backgroundColor = `hsl(${backgroundHue}, 30%, 80%)`
      document.getElementById("instruction").style.display = "none"

      // set tracklist while taking care of pagination
      for (let i = 0; i < Math.ceil(response.data.tracks.total / 100) + 1; i++) {
        const newURL = `https://api.spotify.com/v1/playlists/${ID}/tracks?offset=${i*100}&limit=100`

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
    setTimeout(() => ref.current.style.opacity = 0, 300)
    setTimeout(() => ref.current.style.display = "none", 400)
  }

  // For random color
  const [backgroundHue] = useState(1 + Math.random() * (360 - 1))
  document.body.style.backgroundColor = `hsl(${backgroundHue}, 30%, 80%)`
  document.body.style.color = `hsl(${backgroundHue}, 100%, 20%)`
  

  return (
    <main className="App">
      
      <div className="alert-message" ref={copied}>Copied!</div>
      <div className="alert-message" ref={tryagain}>Try again with a valid playlist ID or link</div>

      <header>
        <h2><a href="/">Spotlist</a></h2>
        <form onSubmit={event => GetPlaylist(event, playlistID)} autoComplete="off">
          <input type="text" id="playlist" name="playlist" value={userInput} placeholder="Enter Playlist ID or Link" onChange={event => setInput(event.target.value)} required/>
          <button type="submit"><Icon icon={playFill} width="100%" /></button>
        </form>
      </header>

      <div id="content">
        <Results name={playlistName} owner={playlistOwner} tracks={playlistTracks} ShowAlert={ShowAlert} copiedRef={copied} />
        <Instruction GetPlaylist={GetPlaylist} setInput={setInput} />
      </div>
    </main>
  )
}

export default App
