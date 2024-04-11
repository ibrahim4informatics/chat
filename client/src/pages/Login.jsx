import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Heading, Image, Text, FormControl, FormHelperText, FormErrorMessage, FormLabel, Input, InputGroup, InputRightElement, Button, Divider } from '@chakra-ui/react'
import { VisibilityOffOutlined, VisibilityOutlined, Google } from '@mui/icons-material'
import logo from '../assets/chat.png'
import { isStrongPassword, isEmail } from '../utils/validations.js';
import t from '../utils/theme.js'
import axios from '../utils/axios.conf.js'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [cookies, setCookie] = useCookies();
    const nav = useNavigate()
    const [isDark, setIsDark] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [credentials, setCrednetials] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false);
    useEffect(() => {
        let token = cookies.accessToken;
        console.log(token)
        if (!token) {
            axios.get('/user/profile').then(
                res => { if (res.status === 200) nav('/') }
            )
        }
        else {
            console.log('nice')
            axios.get('/user/profile', { headers: { Authorization: `Bearer ${cookies.accessToken}` } }).then(
                res => { if (res.status === 200) return nav('/') }
            )
                .catch(err => {
                    if (err.response.status === 401) {
                        axios.post('/auth/refresh-token').then(res => {
                            if (res.status === 200) {
                                setCookie('accessToken', res.data.accessToken);
                                nav('/')
                            }
                        })
                            .catch(err => {
                                return nav('/login')
                            })
                    }
                })
        }

    }, [])
    const hundleLoginClick = () => {
        if (emailError || passwordError || !credentials.email || !credentials.password) return;
        else {
            axios.post('/auth/login-email', credentials).then(
                res => {
                    setCookie('accessToken', res.data.accessToken);
                    return nav('/');

                }
            )
                .catch(err => {
                    setEmailError("invalid email or password");
                    setPasswordError("invalid email or password");
                    return
                })
        }
    }
    const hundleGoogleLogin = () => {
        window.location = (`${import.meta.env.VITE_API_URL}/auth/google`)
    }
    const hundleEmailInputChange = (e) => {
        const email = e.target.value;
        if (!isEmail(email)) {
            setCrednetials({ ...credentials, email })
            setEmailError(true);
        }
        else {
            setCrednetials({ ...credentials, email });
            setEmailError(false)
        }
    }
    const hundlePasswordInputChange = (e) => {
        const pw = e.target.value;
        if (!isStrongPassword(pw)) {
            setCrednetials({ ...credentials, password: pw })
            setPasswordError(true);
        }
        else {
            setCrednetials({ ...credentials, password: pw });
            setPasswordError(false)
        }
    }
    const showHidePasswordHundler = () => setShowPassword(prev => !prev)
    return (
        <Box w={'100%'} h={{ base: '100svh', lg: '100vh' }} bg={isDark ? t.dark.bg : t.light.bg} color={isDark ? t.dark.color : t.light.color} display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <Box w={'100%'} maxW={'350px'} py={4}>
                <Image w={'48px'} src={logo} />
                <Heading as={'h1'} mt={3} ms={1} size={'md'} >Login to ChatMingle</Heading>
                <Text mt={1} ms={1} color={'GrayText'} fontSize={14}>talk tou your favourite persons</Text>
                <Box mt={3}>
                    <FormControl isInvalid={emailError} isRequired>
                        <FormLabel>Email:</FormLabel>
                        <Input onChange={hundleEmailInputChange} value={credentials.email} type='email' borderColor={'#DBDDE0'} focusBorderColor='#C148E9' />
                        <FormErrorMessage>invalid email</FormErrorMessage>
                        <FormHelperText>ex: johnstat@hotmail.com</FormHelperText>
                    </FormControl>
                    <FormControl isInvalid={passwordError} isRequired>
                        <FormLabel>Password:</FormLabel>
                        <InputGroup>
                            <Input onChange={hundlePasswordInputChange} value={credentials.password} type={showPassword ? 'text' : 'password'} borderColor={'#DBDDE0'} focusBorderColor='#C148E9' />
                            <InputRightElement>
                                <Button onClick={showHidePasswordHundler} bg={'transparent'} color={isDark ? t.dark.color : t.light.color} _hover={{ bg: 'transparent' }} _focus={{ bg: 'transparent' }}  > {!showPassword ? <VisibilityOffOutlined color='#fff' /> : <VisibilityOutlined color='#fff' />} </Button>
                            </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>invalid password</FormErrorMessage>
                    </FormControl>
                    <Button opacity={(passwordError || emailError || !credentials.email || !credentials.password) ? 0.4 : 1} cursor={(passwordError || emailError || !credentials.email || !credentials.password) ? 'not-allowed' : 'pointer'} onClick={hundleLoginClick} mt={3} w={'100%'} py={2} colorScheme='purple' >Login</Button>
                    <Divider height={'15px'} />
                    <Text fontSize={16} fontWeight={'bold'} mt={1} textAlign={'center'}>Or</Text>
                    <Button onClick={hundleGoogleLogin} w={'100%'} py={2} mt={2} bg={'#fff'} border={'1px solid #DFE0E3'} borderRadius={'md'}>
                        <Google color='#565B68' /> oogle
                    </Button>
                    <Box w={'100%'} mt={3} display={'flex'} alignItems={'center'}>
                        <Text fontSize={16} color={'GrayText'} me={3}>Don't have an account?</Text>
                        <Link to={'/register'}><Text color={'purple'}>Register here.</Text></Link>
                    </Box>

                </Box>
            </Box>

        </Box>
    )
}

export default Login