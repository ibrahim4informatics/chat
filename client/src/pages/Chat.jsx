import { Avatar, AvatarBadge, Box, Heading, Button, Show, Hide, Divider, InputGroup, Input, InputRightElement, Text } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Toolbar from '../components/Toolbar';
import { DeleteOutline, SendOutlined } from '@mui/icons-material';
import t from '../utils/theme'
import Message from '../components/Message';
import { UserContext } from '../contexts/UserContext';
import { useContext } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axios.conf'
import Loading from '../components/Loading';
import { socket } from '../utils/socket';

const Chat = () => {
    const chatRef = useRef(null)
    const [message, setMessage] = useState('')
    const [user, setUser] = useContext(UserContext);
    const [cookies, setCookie] = useCookies();
    const nav = useNavigate()
    const { chat_id } = useParams()
    const username = 'bbb';
    const isActive = true;
    const [chatData, setChatData] = useState(null);




    useEffect(() => {

        const token = cookies.accessToken;
        axios.get('/user/profile', { headers: token ? { Authorization: `Bearer ${cookies.accessToken}` } : null }).then(res => { setUser(res.data.user); socket.connect() }).catch(err => {
            if (err.response.status === 401) {
                if (!token) return nav('/login')
                axios.post('/auth/refresh-token').then(res => { setCookie('accessToken', res.data.accessToken) }).catch(err => {
                    if (err.response.status === 401) return nav('/login')
                    console.log(err)
                })
            }
            else {
                console.log(err)

            }
        })


    }, [])
    const sendMessage = () => {
        socket.emit('send', message, user.id, chat_id)
        return setMessage('')
    }

    useEffect(() => {
        const token = cookies.accessToken
        axios.get(`/chats/${chat_id}`, { headers: token && { Authorization: `Bearer ${token}` } })
            .then(res => {
                setChatData(res.data.chat);
            }).catch(err => {
                console.log(err)
            })
    }, [chatData])
    useEffect(() => {
        if (chatData) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chatData])
    return (
        <>

            {user !== null ? (<>

                <Toolbar />
                <Box w={'100%'} h={{ base: 'auto', lg: 'calc(100vh - 60px)' }} display={'flex'}>
                    <Hide below='lg'>
                        <Sidebar />
                    </Hide>
                    {chatData ? (<Box w={'100%'}>
                        <Box w={'100%'} alignItems={'cneter'} justifyContent={'center'} >
                            <Box bg={'#EDF2F7'} w={"100%"} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                                <Box m={2} display={'flex'} alignItems={'center'}>
                                    <Avatar mr={2} size={'md'} name={chatData.members[0].username}>
                                        <AvatarBadge boxSize='0.9em' bg={chatData.members[0].isActive ? t.light.primary : "#eee"} borderColor={'purple.200'} />
                                    </Avatar>
                                    <Heading ml={2} size={'md'} fontWeight={'bold'} >{chatData.members[0].username}</Heading>
                                </Box>
                                <Button mr={2} colorScheme='red'><DeleteOutline /></Button>
                            </Box>
                        </Box>

                        <Box ref={chatRef} h={'calc(100vh - 60px - 150px)'} overflowY={'auto'} display={'flex'} flexDir={'column-reverse'}>
                            {chatData.messages.map(msg => <Message content={msg.content} key={msg.id} isClientMessage={msg.sender_id === user.id} />)}
                        </Box>
                        <Divider h={'1px'} bg={'purple.400'} />

                        <InputGroup>
                            <Input h={'80px'} placeholder='enter a messsage.' focusBorderColor={t.light.primary} variant={'filled'} value={message} onChange={(e) => setMessage(e.target.value)} />
                            <InputRightElement display={'flex'} h={'100%'} mt={'auto'} mb={'auto'} mr={2}>
                                <Button size={'lg'} colorScheme='purple' onClick={sendMessage}><SendOutlined /></Button>
                            </InputRightElement>
                        </InputGroup>

                    </Box>) : <Loading />}
                </Box>

            </>) : <><Loading /> <p style={{ display: 'none' }} ref={chatRef}></p></>}

        </>
    )
}

export default Chat