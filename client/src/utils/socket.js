import { io } from 'socket.io-client'
const url = `http://localhost:3000`;
import axios from './axios.conf'

export const socket = io(url, { autoConnect: false })
socket.on('disconnect', () => {
    const token = getCookie('accessToken');
    axios.patch('/user/set-inactive', null, { headers: token && { Authorization: `Berer ${token}` } })
        .then(res => {
            console.log(res)
        })
        .catch(err => { console.log(err) })
})


socket.on('connect', () => {

    const token = getCookie('accessToken');
    axios.patch('/user/set-active', null, { headers: token && { Authorization: `Berer ${token}` } })
        .then(res => {
            console.log(res)
        })
        .catch(err => { console.log(err) })

})


function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Check if this is the cookie we're looking for
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    // Cookie not found
    return null;
}