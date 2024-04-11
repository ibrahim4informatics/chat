import { Box, Image, Button } from '@chakra-ui/react'
import Toolbar from '../components/Toolbar'
import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import logo from '../assets/chat.png'
import { useCookies } from 'react-cookie'
import axios from '../utils/axios.conf'
import { UserContext } from '../contexts/UserContext'
import Loading from '../components/Loading'
import { useNavigate } from 'react-router-dom'
import { socket } from '../utils/socket'


const Home = () => {
  const [cookies, setCookie] = useCookies();
  const [user, setUser] = useContext(UserContext);

  const nav = useNavigate()

  useEffect(() => {

    const token = cookies.accessToken;
    axios.get('/user/profile', { headers: token ? { Authorization: `Bearer ${cookies.accessToken}` } : null }).then(res => {
      setUser(res.data.user);
      socket.connect();
    }).catch(err => {
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
  return (
    <>
      {user !== null ? (<>
        <Toolbar />
        <Box w={'100%'} h={{ base: 'auto', lg: 'calc(100vh - 60px)' }} display={'flex'}>
          <Sidebar />
          <Box w={'100%'} h={'calc(100vh - 60px)'} display={{ base: 'none', lg: 'flex' }} alignItems={'center'} justifyContent={'center'} >
            <Image w={"180px"} h={"180px"} src={logo} mt={'auto'} mb={'auto'} />
          </Box>
        </Box>
      </>) : <Loading />}
    </>
  )
}

export default Home