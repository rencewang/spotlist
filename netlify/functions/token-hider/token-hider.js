const process = require('process')
const axios = require('axios')
const qs = require('qs')

const playlistHandler = async function (playlistID) {

  const client_id = process.env.CLIENT_ID
  const client_secret = process.env.CLIENT_SECRET
  const tokenURL = 'https://accounts.spotify.com/api/token'
  const data = qs.stringify({'grant_type':'client_credentials'})
  const auth = Buffer.from(`${client_id}:${client_secret}`, 'utf-8').toString('base64')

  const getAuth = async () => {
    try {
      const response = await axios.post(tokenURL, data, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded' 
        }
      })
      console.log(response)
      return response.data.access_token
    } catch (error) {
      console.log(error)
    }
  }
  
  const token = await getAuth()
  const callURL = `https://api.spotify.com/v1/playlists/${playlistID}`

  try {
    const response = await axios.get(callURL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    console.log(response)
    return response.data
  } catch (error) {
    console.log(error)
  }
}

module.exports = { playlistHandler }
