import { Box, Flex, Grid, IconButton, Image, Input, Spinner, Text, useClipboard } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { RiFileCopyLine } from 'react-icons/ri'
import { useQuery } from 'react-query'
import { api } from '../services/api'

type MeetingProps = {
  startDate: string
  endDate: string
  roomUrl: string
  meetingId: string
}

const Home: NextPage = () => {
  const [urlValue, setUrlValue] = useState('')

  const { data: allMeetings, isLoading } = useQuery('AllMeetings', async () => {
    const { data } = await api.get('/whereby/all')

    return data
  }, {
    staleTime: 1000 * 60 * 15
  })

  const { hasCopied, onCopy } = useClipboard(urlValue)

  return (
    <>
      <Head>
        <title>Meethub - Provedor de Salas Whereby</title>
      </Head>
      <Box>
        <Flex
          width={'100%'}
          justify={'center'}
          my={8}
        >
          <Image
            src='/logo.svg'
            alt='Meethub logo'
            width={'150px'}
          />
        </Flex>

        {isLoading ? (
          <Flex
            width={'100%'}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <Spinner />
          </Flex>
        ) : (
          <Grid
            templateColumns={'repeat(3, 1fr)'}
            p={8}
            gap={8}
          >
            {allMeetings.reverse().map((meet: MeetingProps, id: number) => {
              return (
                <Box
                  key={id}
                  boxShadow={'lg'}
                  borderRadius={'lg'}
                  p={8}
                >
                  <Flex
                    width={'100%'}
                    justifyContent={'flex-end'}
                  >
                    <Text
                      fontSize={'12px'}
                      color={'gray.400'}
                    >
                      {meet.meetingId}
                    </Text>
                  </Flex>
                  <Text >{meet.startDate}</Text>
                  <Text >{meet.endDate}</Text>
                  <Flex
                    w='100%'
                    gap={4}
                  >
                    <Input value={meet.roomUrl} isReadOnly />
                    <IconButton
                      aria-label='copy button'
                      icon={<RiFileCopyLine />}
                      onClick={() => {
                        setUrlValue(meet.roomUrl),
                          onCopy()
                      }}
                    />
                  </Flex>
                </Box>
              )
            })
            }
          </Grid>
        )}
      </Box>
    </>
  )
}

export default Home
