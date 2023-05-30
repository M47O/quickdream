import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import apiUrl from './api'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'
import ProfileByIdPage from './pages/ProfileByIdPage'
import Header from './components/Header'

import { ThemeProvider } from '@mui/material/styles'
import theme from './Theme'

function App() {
  let [loggedInUser, setLoggedInUser] = useState(null)

  const getUser = useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${apiUrl}/auth/user`);
        const data = await response.json();
        setLoggedInUser({ username: data.username, id: data._id, avatar: data.avatar });
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  // console.log(user)

  const handleLogin = (user) => {
    setLoggedInUser(user)
  }

  const handleLogout = () => {
    setLoggedInUser(null)
  }

  return (
    <ThemeProvider theme={theme}>
      <Header loggedInUser={loggedInUser} handleLogout={handleLogout} />
      <div className="container">
        <main>
          <Routes>
            <Route path="/" element={<HomePage loggedInUser={loggedInUser} />} />
            <Route path="/auth" element={<AuthPage loggedInUser={loggedInUser} handleLogin={handleLogin} />} />
            <Route path="/profile" element={<ProfilePage loggedInUser={loggedInUser} />} />
            <Route path="/profile/:id" element={<ProfileByIdPage loggedInUser={loggedInUser} />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
