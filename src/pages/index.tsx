import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  IconButton,
  Image,
  Input,
  Spinner,
  Text,
  useClipboard,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { RiFileCopyLine } from 'react-icons/ri'
import { TbTrash } from 'react-icons/tb'
import { useQuery } from 'react-query'
import { MeetCreateModal } from '../Components/MeetCreateModal'
import { MeetDeleteModal } from '../Components/MeetDeleteModal'
import { api } from '../services/api'

type MeetingProps = {
  startDate: string
  endDate: string
  roomUrl: string
  meetingId: string
}

const Home: NextPage = () => {
  const toast = useToast()
  const [urlValue, setUrlValue] = useState('')
  const [meetIdValue, setMeetIdValue] = useState('')
  const { onCopy } = useClipboard(urlValue)
  const { isOpen, onClose, onOpen } = useDisclosure()
  const {
    isOpen: isOpenCreateModal,
    onClose: onCloseCreateModal,
    onOpen: onOpenCreateModal
  } = useDisclosure()

  const { data: allMeetings, isLoading } = useQuery('AllMeetings', async () => {
    const { data } = await api.get('/whereby/all')

    return data
  }, {
    staleTime: 1000 * 60 * 15
  })

  const handleClipboard = async (value: string) => {
    async function handler() {
      setUrlValue(value)
      onCopy()
      toast({
        status: 'success',
        title: 'Copiado',
        duration: 750
      })
    }
    await handler()
  }

  const handleFormatDate = (value: string) => {
    return new Date(value).toLocaleDateString('pt-BR', {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: 'numeric',
      minute: 'numeric'
    })
  }

  const handleDeleteModal = async (value: string) => {
    async function handler() {
      setMeetIdValue(value)
      onOpen()
    }

    await handler()
  }

  return (
    <>
      <Head>
        <title>Meethub - Provedor de Salas Whereby</title>
      </Head>
      <Flex
        direction={'column'}
        margin={'0 auto'}
        maxWidth={'1440px'}
      >
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

        <Flex
          width={'100%'}
          justify={'flex-end'}
          px={8}
        >
          <Button
            bg={'blue.500'}
            _hover={{
              bg: 'blue.500'
            }}
            color={'white'}
            size={'lg'}
            onClick={onOpenCreateModal}
          >
            Adicionar sala
          </Button>
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
            templateColumns={{
              base: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
              xl: 'repeat(3, 1fr)',
            }}
            p={8}
            gap={8}
          >
            {allMeetings.slice(0).reverse().map((meet: MeetingProps, id: number) => {
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
                  <Flex
                    w='100%'
                    gap={8}
                    my={4}
                  >
                    <Box>
                      <Text
                        color={'gray.400'}
                      >
                        Criação da sala
                      </Text>
                      <Heading
                        fontSize={'lg'}
                        fontWeight={'semibold'}
                      >
                        {handleFormatDate(meet.startDate)}
                      </Heading>
                    </Box>
                    <Box>
                      <Text
                        color={'gray.400'}
                      >
                        Data do meet
                      </Text>
                      <Heading
                        fontSize={'lg'}
                        fontWeight={'semibold'}
                      >
                        {handleFormatDate(meet.endDate)}
                      </Heading>
                    </Box>
                  </Flex>
                  <Flex
                    w='100%'
                    gap={4}
                  >
                    <Input value={meet.roomUrl} isReadOnly />
                    <IconButton
                      aria-label='copy button'
                      icon={<RiFileCopyLine />}
                      background={'blue.400'}
                      _hover={{
                        bg: 'blue.400'
                      }}
                      color={'white'}
                      onClick={() => handleClipboard(meet.roomUrl)}
                    />
                    <IconButton
                      aria-label='copy button'
                      icon={<TbTrash />}
                      background={'red.400'}
                      _hover={{
                        bg: 'red.400'
                      }}
                      color={'white'}
                      onClick={() => handleDeleteModal(meet.meetingId)}
                    />
                  </Flex>
                </Box>
              )
            })
            }
          </Grid>
        )}
      </Flex>
      <MeetDeleteModal isOpen={isOpen} onClose={onClose} meetId={meetIdValue} />
      <MeetCreateModal isOpen={isOpenCreateModal} onClose={onCloseCreateModal} />
    </>
  )
}

export default Home
