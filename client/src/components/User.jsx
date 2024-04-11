import React from 'react'
import { Box, Avatar, AvatarBadge, Heading } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from '../utils/axios.conf'
const User = ({ username, id, isActive }) => {
    const nav = useNavigate();
    const [cookies] = useCookies();
    const hundleClick = () => {
        const token = cookies.accessToken;
        axios.post('/chats', { receiver_id: id, msg: "hi!" }, { headers: token && { Authorization: `Bearer ${token}` } })
            .then(res => {
                if (res.status === 201) {
                    return nav(`/${res.data.chat.id}`)
                }
            })
            .catch(err => { 
                if(err.response.status === 300){
                    return nav(`/${err.response.data.chat_id}`)
                }
             })

    }
    return (
        <Box onClick={hundleClick} _hover={{ opacity: .9 }} cursor={'pointer'} bg={'#EDF2F7'} display={'flex'} alignItems={'center'} py={2} px={1} borderRadius={'md'} my={2}>
            <Avatar size={'md'} name={username}>
                <AvatarBadge boxSize='0.9em' bg={isActive ? t.light.primary : "#eee"} borderColor={'purple.200'} />
            </Avatar>

            <Heading ml={2} size={'md'} fontWeight={'bold'} >{username}</Heading>
        </Box>
    )
}

export default User