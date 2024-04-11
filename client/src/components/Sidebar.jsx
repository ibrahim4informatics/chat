import { Box, Divider, Heading } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import SearchBar from './SearchBar'
import Conversations from './Conversations'
import { UserContext } from '../contexts/UserContext'

const Sidebar = () => {
    const [user] = useContext(UserContext);

    return (
        <>

            <Box bg={'#fff'} w={{ base: '100%', lg: '450px' }} p={2} h={{ base: 'auto', lg: 'calc(100vh - 60px)' }}>
                <SearchBar />
                <Box marginInline={'auto'} mt={3} w={'100%'} maxW={'650px'} >
                    <Heading mt={5} textAlign={'left'} size={'lg'} color={'#141414'}>Chats</Heading>
                    
                    {user.Chats.length > 0 ? user.Chats.map(chat => <Conversations id={chat.id} key={chat.id} username={chat.members[0].username} isActive={chat.members[0].isActive}/>) : null}

                </Box>
            </Box>
            <Divider display={{ base: 'none', lg: 'block' }} w={'1px'} bg={'#EDF2F7'} orientation='vertical' />
        </>
    )
}

export default Sidebar