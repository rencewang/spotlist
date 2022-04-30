import React from "react"
import './App.scss'

export default () => {
    return (
      <section id="instruction">
        <div>
        <h1>Access any Spotify playlist using its playlist ID or link</h1>
          <h3>For a copy-and-pastable list of track, artist, and album names.</h3>

          <div style={{fontSize: "30px", fontWeight: "700", marginTop: "30px", marginBottom: "5px", fontStyle: "italic"}}>Try these playlists?</div>

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
        </div>
      
        <footer>
          Spotlist is <a href="https://github.com/law-wang/spotlist" rel="noopener noreferrer" target="_blank">built</a> by <a href="https://www.rence.la/" rel="noopener noreferrer" target="_blank">Lawrence</a> using React and Spotify API :)
        </footer>
      </section>
    )
}
