import React from "react"
import './App.scss'

export default () => {
    return (
        <div id="instruction">
        <section id="instruction-left">
          <div style={{fontSize: "40px", marginBottom: "5px", fontWeight: "700"}}>Access any Spotify playlist using its playlist ID or link</div>
          <div>For a copy-and-pastable list of track, artist, and album names.</div>
          <div style={{fontSize: "30px", fontWeight: "700", marginTop: "30px", marginBottom: "5px", fontStyle: "italic"}}>Something to get started with?</div>
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
        </section>
        <section id="instruction-right" style={{fontSize: "15px"}}>
          <div style={{fontSize: "20px", marginBottom: "10px"}}>Spotlist is a <a href="https://github.com/law-wang/spotlist">project</a> by <a href="https://www.rence.la/">Lawrence</a> using React and Spotify API.</div>
          <div><b>2020.08.02:</b> initial launch.</div>
          <div><b>2020.08.16:</b> neumorphic style update.</div>
          <div><b>2021.01.22:</b> table style overhaul.</div>
          <div><b>2021.01.23:</b> home page style overhaul; random background color; playlist content links to Spotify; search with playlist link in addition to ID. </div>
        </section>
        </div>
    )
}
