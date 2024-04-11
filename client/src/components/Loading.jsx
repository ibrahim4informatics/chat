import React from 'react'
import { Box,Spinner } from '@chakra-ui/react'

const Loading = () => {
    return (
        <Box w={'100%'} h={{ base: '100svh', lg: '100vh' }} display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <Spinner size={'xl'} color='purple.400' />
        </Box>
    )
}

export default Loading