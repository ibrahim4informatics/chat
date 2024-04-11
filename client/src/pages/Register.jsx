import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Heading, Image, Text, FormControl, FormHelperText, FormErrorMessage, FormLabel, Input, InputGroup, InputRightElement, Button, Divider } from '@chakra-ui/react'
import { VisibilityOffOutlined, VisibilityOutlined, Google } from '@mui/icons-material'
import { useCookies } from 'react-cookie'
import logo from '../assets/chat.png'
import t from '../utils/theme.js'
import { isStrongPassword, isEmail, isUsername } from '../utils/validations.js';
import axios from '../utils/axios.conf.js';

const Register = () => {
    const [cookies, setCookie] = useCookies()
    const [isDark, setIsDark] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');
    const [usernameError, setUsernameError] = useState('')
    const [data, setData] = useState({ username: '', email: '', password: '', confirm: '' })
    const nav = useNavigate()
    const hundleGoogleAuth = () => {
        return window.location = `${import.meta.env.VITE_API_URL}/auth/google`
    }
    useEffect(() => {
        let token = cookies.accessToken;
        if (!token) {
            axios.get('/user/profile').then(
                res => { if (res.status === 200) nav('/') }
            )
        }
        else {
            axios.get('/user/profile', { headers: { Authorization: `Bearer ${cookies.accessToken}` } }).then(
                res => { if (res.status === 200) nav('/') }
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
                                return nav('/register')
                            })
                    }
                })
        }

    }, [])
    const showHidePasswordHundler = () => setShowPassword(prev => !prev)
    const emailInputChangeHundler = (e) => {
        const email = e.target.value;
        setData({ ...data, email });
        if (!isEmail(email)) {
            setEmailError('invalid email format');
        }
        else {
            setEmailError('')
        }
    }
    const usernameInputChangeHundler = (e) => {
        const username = e.target.value;
        setData({ ...data, username });
        if (!isUsername(username)) {
            setUsernameError('invalid username format')

        }
        else {
            setUsernameError('')
        }
    }
    const passwordInputChangeHundler = (e) => {
        const password = e.target.value;
        setData({ ...data, password });
        if (password !== data.confirm) {
            setConfirmError('password and confirm password are not the same')
        }
        else {
            setConfirmError('')
        }
        if (!isStrongPassword(password)) {
            setPasswordError("password is weak")
        }
        else {
            setPasswordError('')
        }
    }
    const confirmInputHundler = (e) => {
        const confirm = e.target.value;
        setData({ ...data, confirm });
        if (data.password !== confirm) {
            setConfirmError('confirme password and password are not the same')
        }
        else {
            setConfirmError('')
        }
    }
    const registerClickHundler = () => {
        if (emailError || passwordError || usernameError || confirmError || !data.email || !data.username || !data.password || !data.confirm) return
        axios.post('/auth/register-email', data).then(
            res => {
                setCookie('accessToken', res.data.accessToken, { maxAge: 1000 * 60 * 15 });
                return nav('/');

            }
        )
            .catch(err => {
                const errorMessage = err.response.data.msg;
                if (errorMessage === "missing data") {
                    setConfirmError("All Fields Are Required");
                    setEmailError("All Fields Are Required");
                    setUsernameError("All Fields Are Required");
                    setPasswordError("All Fields Are Required");
                    return
                }
                else if (errorMessage === 'invalid email') return setEmailError(errorMessage);
                else if (errorMessage === 'invalid password') return setPasswordError(errorMessage);
                else if (errorMessage === 'passwords doesn\'t matches') return setConfirmError("the confirm password is not the same as the password");
                else if (errorMessage === 'email is used') return setEmailError(errorMessage)
                else if (errorMessage === 'username is used') return setUsernameError(errorMessage)
                else {
                    // TODO: hundle server error with react toast
                }
            })
    }

    return (
        <Box w={'100%'} minH={{ base: '100svh', lg: '100vh' }} bg={isDark ? t.dark.bg : t.light.bg} color={isDark ? t.dark.color : t.light.color} display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <Box w={'100%'} maxW={'350px'} py={4}>
                <Image w={'48px'} src={logo} />
                <Heading as={'h1'} mt={3} ms={1} size={'md'} >Register in ChatMingle</Heading>
                <Text mt={1} ms={1} color={'GrayText'} fontSize={14}>create an acount and start conversations with peoples</Text>
                <Box mt={3}>
                    <FormControl isInvalid={emailError} isRequired>
                        <FormLabel>Email:</FormLabel>
                        <Input type='email' onChange={emailInputChangeHundler} value={data.email} borderColor={'#DBDDE0'} focusBorderColor='#C148E9' />
                        <FormErrorMessage>{emailError}</FormErrorMessage>
                        <FormHelperText>ex: johnstat@hotmail.com</FormHelperText>
                    </FormControl>
                    <FormControl isInvalid={usernameError} isRequired>
                        <FormLabel>Username:</FormLabel>
                        <Input onChange={usernameInputChangeHundler} value={data.username} type='text' borderColor={'#DBDDE0'} focusBorderColor='#C148E9' />
                        <FormErrorMessage>{usernameError}</FormErrorMessage>
                        <FormHelperText>the username contains only letters and digits and underscore (3 character at least)</FormHelperText>
                    </FormControl>
                    <FormControl isInvalid={passwordError} isRequired>
                        <FormLabel>Password:</FormLabel>
                        <InputGroup>
                            <Input onChange={passwordInputChangeHundler} value={data.password} type={showPassword ? 'text' : 'password'} borderColor={'#DBDDE0'} focusBorderColor='#C148E9' />
                            <InputRightElement>
                                <Button onClick={showHidePasswordHundler} bg={'transparent'} color={isDark ? t.dark.color : t.light.color} _hover={{ bg: 'transparent' }} _focus={{ bg: 'transparent' }}  > {!showPassword ? <VisibilityOffOutlined color={isDark ? t.dark.color : t.light.color} /> : <VisibilityOutlined color={isDark ? t.dark.color : t.light.color} />} </Button>
                            </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>{passwordError}</FormErrorMessage>
                        <FormHelperText>the password must contains at lest 1 capital letter, 1 digit, 1 special character <br /> allowed special characters: @,$,!,%,*,?,&  </FormHelperText>
                    </FormControl>
                    <FormControl isInvalid={confirmError} isRequired>
                        <FormLabel>Confirme:</FormLabel>
                        <Input onChange={confirmInputHundler} value={data.confirm} type={showPassword ? 'text' : 'password'} borderColor={'#DBDDE0'} focusBorderColor='#C148E9' />
                        <FormErrorMessage>{confirmError}</FormErrorMessage>
                    </FormControl>
                    <Button
                        opacity={(emailError || usernameError || passwordError || confirmError || !data.email || !data.username || !data.password || !data.confirm) ? .4 : 1}
                        cursor={(emailError || usernameError || passwordError || confirmError || !data.email || !data.username || !data.password || !data.confirm) ? 'not-allowed' : 'pointer'}
                        onClick={registerClickHundler} mt={3} w={'100%'} py={2} colorScheme='purple'>Register
                    </Button>
                    <Divider height={'15px'} />
                    <Text fontSize={16} fontWeight={'bold'} mt={1} textAlign={'center'}>Or</Text>
                    <Button onClick={hundleGoogleAuth} w={'100%'} py={2} mt={2} bg={'#fff'} border={'1px solid #DFE0E3'} borderRadius={'md'}>
                        <Google color='#565B68' /> oogle
                    </Button>
                    <Box w={'100%'} mt={3} display={'flex'} alignItems={'center'}>
                        <Text fontSize={16} color={'GrayText'} me={3}>already have an account?</Text>
                        <Link to={'/login'}><Text color={'purple'}>Login here.</Text></Link>
                    </Box>

                </Box>
            </Box>

        </Box>
    )
}

export default Register