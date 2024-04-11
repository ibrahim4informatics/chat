import { Avatar, AvatarBadge, Box, Heading } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import t from '../utils/theme';
import React from 'react'

const Conversations = ({ username, isActive, id }) => {
    const nav = useNavigate();
    return (
        <Box onClick={() => nav(`/${id}`) } _hover={{ opacity: .9 }} cursor={'pointer'} bg={'#EDF2F7'} display={'flex'} alignItems={'center'} py={2} px={1} borderRadius={'md'} my={2}>
            <Avatar size={'md'} name={username}>
                <AvatarBadge boxSize='0.9em' bg={isActive ? t.light.primary : "#eee"} borderColor={'purple.200'} />
            </Avatar>

            <Heading ml={2} size={'md'} fontWeight={'bold'} >{username}</Heading>
        </Box>
    )
}

export default Conversations