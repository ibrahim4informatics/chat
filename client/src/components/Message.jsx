import { Box } from '@chakra-ui/react'
import React from 'react'

const Message = ({ isClientMessage, content }) => {
    return (
        <Box w={'auto'} maxW={'75%'} py={'20px'} px={'30px'} fontSize={18} my={2} mx={3} alignSelf={isClientMessage ? 'flex-end' : 'flex-start'} color={isClientMessage ? 'white' : '#141414'} borderRadius={'md'} bg={isClientMessage ? 'purple.400' : '#E6E5E6'}>
            {content}
        </Box>
    )
}

export default Message