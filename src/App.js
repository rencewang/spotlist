import React, {useState, useEffect} from 'react'
import './App.css'

function App() {

  const [playlistID, setID] = useState('')
  const [playlistName, setName] = useState('')
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
          if (typeof body === 'object' && body !== null) {
            if (body.name !== undefined) {setName(body.name)}
            if (body.owner !== undefined) {setOwner(body.owner.display_name)}
            if (body.tracks !== undefined) {setTrack(body.tracks.items)}
          }
        })
      }
    })
    console.log(playlistTracks)
    console.log(playlistID)
  }

  return (
    <main className="App">
      <form onSubmit={GetPlaylist} autoComplete="off" className="trackIDform">
        <label htmlFor="playlist">Playlist ID: </label>
        <input type="text" id="playlist" name="playlist" value={playlistID} onChange={event => setID(event.target.value)} />
        <button type="submit">Submit</button>
      </form>

      <h3>{playlistName}</h3>
      <h3>{playlistOwner}</h3>

      <table className="tracklisting">
      <tbody>
        <tr>
          <th>Track</th>
          <th>Artist</th>
          <th>Album</th>
          <th>Date Added</th>
        </tr>
        {playlistTracks.map((track, index) => (
          <tr key={index}>
            <td>{track.track.name}</td>
            <td>
              {track.track.artists.map((artist, index) => (
                index === 0 ? <span key={index}>{artist.name}</span> : <span key={index}>, {artist.name}</span>
              ))}
            </td>
            <td>{track.track.album.name}</td>
            <td>{track.added_at.substring(0, 10)}</td>
          </tr>
        ))}
      </tbody>
      </table>

    </main>
  )
}

export default App
