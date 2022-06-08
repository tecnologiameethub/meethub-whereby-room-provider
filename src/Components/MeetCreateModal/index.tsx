import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useToast
} from '@chakra-ui/react'
import { useState } from 'react'
import { useMutation } from 'react-query'
import { queryClient } from '../../pages/_app'
import { api } from '../../services/api'

type CreationModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function MeetCreateModal({ isOpen, onClose }: CreationModalProps) {
  const toast = useToast()
  const [endDate, setEndDate] = useState('')

  const mutation = useMutation(async (value: string) => {
    await api.post('/whereby/create', {
      endDate: value
    })
  }, {
    onSuccess: () => {
      toast({
        status: 'info',
        title: 'Sala criada com sucesso'
      })
      onClose()
      queryClient.invalidateQueries('AllMeetings')
    }
  })

  const handleCreateMeet = () => {
    mutation.mutateAsync(endDate)
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
              Criar nova sala
            </Heading>
            <Box>
              <FormControl>
                <FormLabel htmlFor='endDate'>Data e hora d término</FormLabel>
                <Input
                  name={'enDate'}
                  type='datetime-local'
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </FormControl>
              <Flex
                width={'100%'}
                justify={'flex-end'}
                my={8}
              >
                <Button
                  onClick={handleCreateMeet}
                >
                  Criar sala
                </Button>
              </Flex>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}