import axios from 'axios'

export const wherebyApi = axios.create({
  baseURL: 'https://api.whereby.dev/v1/meetings',
  headers: {
    Authorization: `Bearer ${process.env.WHEREBY_API_KEY}`,
    "Content-Type": "application/json",
  }
})