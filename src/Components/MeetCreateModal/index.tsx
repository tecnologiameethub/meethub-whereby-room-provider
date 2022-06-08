import { Box, Button, Flex, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, useToast } from '@chakra-ui/react'
import { useMutation } from 'react-query'
import { queryClient } from '../../pages/_app'
import { api } from '../../services/api'

type CreationModalProps = {
  isOpen: boolean
  onClose: () => void
  meetId: string
}

export function MeetCreateModal({ isOpen, onClose, meetId }: CreationModalProps) {
  const toast = useToast()

  const mutation = useMutation(async (value: string) => {
    await api.delete(`/whereby/delete?meetingId=${value}`)
  }, {
    onSuccess: () => {
      toast({
        status: 'info',
        title: 'Sala excluída com sucesso'
      })
      onClose()
      queryClient.invalidateQueries('AllMeetings')
    }
  })

  const handleDeleteMeet = (value: string) => {
    mutation.mutateAsync(value)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <Box p={8}>
            <Heading
              fontSize={'2xl'}
              mb={8}
            >
              Você tem certeza quer exlcuir a sala?
            </Heading>
            <Flex
              justify={'space-between'}
              gap={8}
            >
              <Button
                background={'red.500'}
                _hover={{
                  bg: 'red.500'
                }}
                color={'white'}
                onClick={() => handleDeleteMeet(meetId)}
              >
                Tenho certeza. Excluir.
              </Button>
              <Button
                onClick={onClose}
              >
                Não quero exlcuir
              </Button>
            </Flex>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}