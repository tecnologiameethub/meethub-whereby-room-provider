import axios from 'axios'

function setupApiClient() {
  if (process.env.NODE_ENV === 'production') {
    return axios.create({
      baseURL: 'https://meethub-whereby-room-provider.vercel.app/api'
    })
  }

  return axios.create({
    baseURL: 'http://localhost:3000/api'
  })
}

export const api = setupApiClient()