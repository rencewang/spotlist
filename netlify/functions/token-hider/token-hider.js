const process = require('process')
const axios = require('axios')
const qs = require('qs')

exports.handler = async function (event, context) {

  const API_PARAMS = qs.stringify(event.queryStringParameters)
  console.log('API_PARAMS', API_PARAMS)

  const {CLIENT_ID, CLIENT_SECRET} = process.env
  const tokenURL = 'https://accounts.spotify.com/api/token'
  const data = qs.stringify({'grant_type':'client_credentials'})
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`, 'utf-8').toString('base64')

  try {
    const response = await axios.post(tokenURL, data, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded' 
      }
    })
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    }
  } catch (error) {
    const { status, statusText, headers, data } = error.response
    return {
      statusCode: error.response.status,
      body: JSON.stringify({ status, statusText, headers, data })
    }
  }
}
