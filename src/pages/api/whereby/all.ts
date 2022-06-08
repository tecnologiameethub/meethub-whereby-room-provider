import { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import { wherebyApi } from '../../../services/wherebyApi'

const handler = nextConnect<NextApiRequest, NextApiResponse>({
  onNoMatch: (request, response) => {
    response.status(404).json({ message: 'Not found!' })
  },
  onError: (err, request, response, next) => {
    response.status(500).json({
      status: err,
      message: 'Something went wrong!'
    })
  }
})

handler.get(async (request, response) => {
  const { data } = await wherebyApi.get('/')

  return response.status(200).json(data.results)
})

export default handler