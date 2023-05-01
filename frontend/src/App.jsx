import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'
import Header from './components/Header'

import { ThemeProvider } from '@mui/material/styles'
import theme from './Theme'

function App() {
  let [user, setUser] = useState(null)

  const getUser = useEffect(() => {
    fetch("http://localhost:4000/auth/user", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setUser({ username: data.username, id: data._id, avatar: data.avatar })
      })
  }, [])

  // console.log(user)

  const handleLogin = (user) => {
    setUser(user)
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <ThemeProvider theme={theme}>
      <Header user={user} handleLogout={handleLogout} />
      <div className="container">
        <main>
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route path="/auth" element={<AuthPage user={user} handleLogin={handleLogin} />} />
            <Route path="/profile" element={<ProfilePage user={user} />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
