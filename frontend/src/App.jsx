import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import apiUrl from './api'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'
import ProfileByIdPage from './pages/ProfileByIdPage'
import FeedPage from './pages/FeedPage'
import Header from './components/Header'

import { ThemeProvider } from '@mui/material/styles'
import theme from './Theme'

function App() {
  let [loggedInUser, setLoggedInUser] = useState(null)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))

    if (user) {
      setLoggedInUser(user)
    }
  }, [])

  const handleLogin = (user) => {
    setLoggedInUser(user)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
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
            <Route path="/feed" element={<FeedPage loggedInUser={loggedInUser} />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
