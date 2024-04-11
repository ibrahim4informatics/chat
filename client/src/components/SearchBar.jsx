import React, { useState } from 'react'
import { InputGroup, Input, InputRightElement, Button, Box, Heading } from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import axios from '../utils/axios.conf';
import { SearchOutlined } from '@mui/icons-material'
import Loading from './Loading'
import theme from '../utils/theme'
import User from './User';

const SearchBar = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [cookies] = useCookies();
    const inputHundleChange = (e) => {
        const value = e.target.value;
        setSearchValue(value)
        const token = cookies.accessToken
        axios.get(`/user/search?username=${value}`, { headers: token && { Authorization: `Bearer ${token}` } })
            .then(res => { setSearchResults(res.data.results) })
            .catch(err => { console.log(err) })

    }
    return (
        <Box pos={'relative'}>

            <Input my={2} borderRadius={'full'} value={searchValue} variant={'filled'} focusBorderColor={theme.light.primary} type='text' placeholder='search for users.' onChange={inputHundleChange} />


            {searchValue ? <Box overflowY={'auto'} h={700} borderRadius={'md'} top={'50px'} w={'100%'} bg={'#EDF2F7'} zIndex={10} pos={'absolute'}>
                <Heading mt={1} textAlign={'center'} size={'md'}>Results</Heading>
                {!searchResults ? <Loading /> : (
                    searchResults.map(user => <User id={user.id} key={user.id} username={user.username} />)
                )}
            </Box> : ''}
        </Box>
    )
}

export default SearchBar