import { Avatar, AvatarBadge, Box, Button, Text, Heading, Divider } from '@chakra-ui/react'
import { LogoutOutlined } from '@mui/icons-material'
import t from '../utils/theme'
import React, { useContext } from 'react'
import { UserContext } from '../contexts/UserContext';
import { useCookies } from 'react-cookie';
import axios from '../utils/axios.conf'
import { useNavigate } from 'react-router-dom'
import { socket } from '../utils/socket';

const Toolbar = () => {
    const [user] = useContext(UserContext);
    const nav = useNavigate()
    const [cookies, setCookie, removeCookie] = useCookies();
    const hundleLogout = () => {

        const token = cookies.accessToken;
        socket.disconnect()
        axios.get('/auth/logout', { headers: token && { Authorization: `Bearer ${token}` } }).then(res => {
            if (res.status === 200) {

                removeCookie('accessToken');
                return nav('/login')
            }
        }).then(err => {
            socket.connect()
            //TODO: hundling server error
        })
    }
    return (
        <>
            <Box zIndex={100} bg={t.light.bg} pos={'sticky'} top={0} w={'100%'} display={'flex'} alignItems={'center'} justifyContent={'space-between'} px={1} py={2}>
                <Box display={'flex'} alignItems={'center'}>
                    <Avatar size={'sm'} name={user?.username}>
                        <AvatarBadge boxSize='1em' bg={t.light.primary} borderColor={'purple.200'} />
                    </Avatar>

                    <Heading ml={2} size={'sm'} fontWeight={'bold'} >{user.username}</Heading>
                </Box>
                <Button onClick={hundleLogout} colorScheme='purple' ><LogoutOutlined /></Button>
            </Box>
            <Divider w={'100%'} />
        </>
    )
}

export default Toolbar