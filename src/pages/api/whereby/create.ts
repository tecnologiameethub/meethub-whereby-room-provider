import { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import { wherebyApi } from '../../../services/wherebyApi'
// import { wherebyApi } from '../../../services/wherebyApi'

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

handler.post(async (request, response) => {
  const { endDate } = request.body
  const UTCStringDate = new Date(endDate).toJSON().toString().replace('.000Z', '-03:00')
  const { data } = await wherebyApi.post(`/`, {
    endDate: UTCStringDate,
    field: ['https://call-meethub.whereby.com/']
  })

  return response.status(200).json(data)
})

export default handler