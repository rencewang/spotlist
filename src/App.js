import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import bxCopy from '@iconify/icons-bx/bx-copy'

import './App.scss'

function App() {

  // getting playlist from Spotify API
  const [playlistID, setID] = useState('')
  const [playlistName, setName] = useState('')
  const [playlistOwner, setOwner] = useState('')
  const [playlistTracks, setTrack] = useState([])

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
          document.getElementById("instruction").style.display = "none"
          if (typeof body === 'object' && body !== null) {
            if (body.name !== undefined) {
              setName(body.name)
              document.getElementById("results").style.display = "block"
              document.getElementById("tryagain").style.display = "none"
            } else {
              document.getElementById("tryagain").style.display = "block"
              document.getElementById("results").style.display = "none"
            }
            if (body.owner !== undefined) {setOwner(body.owner.display_name)}
            if (body.tracks !== undefined) {setTrack(body.tracks.items)}
          }
        })
      }
    })
    console.log(playlistTracks)
    console.log(playlistID)
  }

  // for copy to clipboard button
  function CopyToClipboard(element) {
    var range = document.createRange()
    range.selectNode(document.getElementById( element ))
    window.getSelection().removeAllRanges()
    window.getSelection().addRange(range)
    document.execCommand("copy")
    window.getSelection().removeAllRanges()
  }

  // for displaying the button
  const [copiedDisplay, setCopiedDisplay] = useState("none")
  const [copiedOpacity, setCopiedOpacity] = useState(0)
  function ShowCopied() {
    console.log("copied")
    setCopiedDisplay("block")
    setCopiedOpacity(100)
    setTimeout(() => setCopiedOpacity(0), 500)
    setTimeout(() => setCopiedDisplay("none"), 1000)
  }

  return (
    <main className="App">

      <div className="copy_msg" style={{display: copiedDisplay, opacity: copiedOpacity}} id="copied">
          Copied!
      </div>

      <form onSubmit={GetPlaylist} autoComplete="off" className="trackIDform">
        <input type="text" id="playlist" name="playlist" value={playlistID} placeholder="Enter Playlist ID" onChange={event => setID(event.target.value)} required/>
        <button type="submit">Let's Go</button>
      </form>

      <div className="results" id="results">
        <h3 id="playlistName">{playlistName}<small>  Playlist Name</small></h3>
        <h3 id="playlistOwner">{playlistOwner}<small>  Published By</small></h3>
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
                  <div id={`${index}trackname`}>{track.track.name}</div>
                  <button onClick={() => {CopyToClipboard(`${index}trackname`); ShowCopied()}}><Icon icon={bxCopy} width="20px" /></button>
                </div>
              </td>
              <td>
                <div className="justify">
                  <div id={`${index}artistname`}>
                    {track.track.artists.map((artist, index) => (
                      index === 0 ? 
                      <span key={index}>{artist.name}</span> : 
                      <span key={index}>, {artist.name}</span>
                    ))}
                  </div>
                  <button onClick={() => {CopyToClipboard(`${index}artistname`); ShowCopied()}}><Icon icon={bxCopy} width="20px" /></button>
                </div>
              </td>
              <td>
                <div className="justify">
                  <div id={`${index}albumname`}>{track.track.album.name}</div>
                  <button onClick={() => {CopyToClipboard(`${index}albumname`); ShowCopied()}}><Icon icon={bxCopy} width="20px" /></button>
                </div>
              </td>
              <td>{track.added_at.substring(5,7)}/{track.added_at.substring(8,10)}/{track.added_at.substring(0,4)}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>

      <div id="tryagain"> 
        <div>Try again</div>
        <div>please enter a valid playlist ID</div>
        <div className="try" style={{fontSize: "40px", marginTop: "30px", marginBottom: "20px", fontStyle: "italic"}}>Want something to get started with?</div>
        <div className="try">Try this: 37i9dQZF1DX5Ejj0EkURtP</div>
        <div className="try">Or this: 37i9dQZF1DXcBWIGoYBM5M</div>
      </div>

      <div id="instruction">
        <div>Get the basic information and tracklist of any Spotify playlist.</div>
        <div className="try" style={{fontSize: "40px", marginTop: "30px", marginBottom: "20px", fontStyle: "italic"}}>Want something to get started with?</div>
        <div className="try">Try this: 37i9dQZF1DX5Ejj0EkURtP</div>
        <div className="try">Or this: 37i9dQZF1DXcBWIGoYBM5M</div>
      </div>

      
    </main>
  )
}

export default App
