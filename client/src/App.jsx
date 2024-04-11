import { ChakraProvider } from '@chakra-ui/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { CookiesProvider } from 'react-cookie'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import { UserContext } from './contexts/UserContext';
import { useState } from 'react';

const routes = createBrowserRouter([
  { path: '/', element: <Home />, errorElement: <Error /> },
  { path: '/login', element: <Login />, errorElement: <Error /> },
  { path: '/register', element: <Register />, errorElement: <Error /> },
  { path: '/:chat_id', element: <Chat />, errorElement: <Error /> },
])


function App() {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={[user,setUser]}>
      <CookiesProvider defaultSetOptions={{ sameSite: true }}>
        <ChakraProvider>
          <RouterProvider router={routes} />
        </ChakraProvider>
      </CookiesProvider>
    </UserContext.Provider>
  )
}

export default App
