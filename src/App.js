import React, {useState, useEffect} from 'react'
import Tracklist from './Tracklist'
import './App.css'

function App() {

  const [playlistID, setID] = useState('')
  const [playlistName, setName] = useState('')
  const [playlistDesc, setDesc] = useState('')
  const [playlistOwner, setOwner] = useState('')
  const [playlistTracks, setTrack] = useState([])

  useEffect(() => {
    
  })

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
          
          if (body.name !== undefined) {setName(body.name)}
          if (body.description !== undefined) {setDesc(body.description)}
          if (body.owner !== undefined) {setOwner(body.owner.display_name)}
          if (body.tracks !== undefined) {setTrack(body.tracks.items)}

          // body.tracks.items.forEach(item => {
          //   setTrack(playlistTracks.concat(item))
          // })
          
          // console.log(body)
          // console.log(playlistDesc)
          // console.log(playlistName)
          // console.log(playlistOwner)
          console.log(playlistTracks)
          // console.log(playlistTracks.length)
        })
      }
    })
    console.log(playlistID)
  }

  return (
    <main className="App">
      <form onSubmit={GetPlaylist} autoComplete="off">
        <label htmlFor="playlist">Playlist ID: </label>
        <input type="text" id="playlist" name="playlist" value={playlistID} onChange={event => setID(event.target.value)} />
        <button type="submit">Submit</button>
      </form>

      <h3>{playlistName}</h3>
      <h3>{playlistOwner}</h3>

      {/* <Tracklist tracks={playlistTracks} /> */}
      <div>
        {playlistTracks.map(track => (
          <div>       
            <h3>{track.added_at}</h3>
            <h3>{track.track.name}</h3>
            <h3>{track.track.album.name}</h3>
            {/* <h3>{track.track.artists.forEach()}</h3> */}
          </div>
        ))}
      </div>

    </main>
  )
}

export default App
