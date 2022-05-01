import React from "react"
import './App.scss'

export default (props) => {
  const {GetPlaylist, setInput} = props
    return (
      <section className="instruction" id="instruction">
        <div>
          <h1>Download Spotify playlist information using its playlist ID or link</h1>
          <p>Get a copy-and-pastable list of track, artist, and album names</p>

          <h3>Try these playlists:</h3>
          <button onClick={event => {GetPlaylist(event, "37i9dQZF1DXcBWIGoYBM5M"); setInput("37i9dQZF1DXcBWIGoYBM5M")}}>Today's Top Hits</button>
          <button onClick={event => {GetPlaylist(event, "37i9dQZF1DX4JAvHpjipBk"); setInput("37i9dQZF1DX4JAvHpjipBk")}}>New Music Friday</button>
          <button onClick={event => {GetPlaylist(event, "4h0CNjEQobeT4W9hPl3YiF"); setInput("4h0CNjEQobeT4W9hPl3YiF")}}>One of my playlists</button>
        </div>
      
        <footer>
          Spotlist is <a href="https://github.com/law-wang/spotlist" rel="noopener noreferrer" target="_blank">built</a> by <a href="https://www.rence.la/" rel="noopener noreferrer" target="_blank">Lawrence</a> using React and Spotify API :)
        </footer>
      </section>
    )
}
