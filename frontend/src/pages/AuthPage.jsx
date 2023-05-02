import { useState } from 'react'
import { IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AuthForm from '../components/AuthForm'
import './css/AuthPage.css'


export default function AuthPage({ user, handleLogin }) {
  const [showGuestInfo, setShowGuestInfo] = useState(true)
  return (
    user ? <p>You're already signed in. Log out to access this page.</p> :
      <div className="auth">
        <AuthForm handleLogin={handleLogin} />

        {showGuestInfo && <div className="auth__guestInfo">
          <p className="auth__guestText">As this is an <Tooltip followCursor={true} title="Minimum Viable Product"><span className="auth__tooltip">MVP</span></Tooltip> and not fully completed, you're welcome to sign up or log in with the guest account below.
            <span className="auth__guestAccount">
              <b>Username:</b> quickdream_guest<br />
              <b>Password:</b> guest123
            </span>
          </p>
          <div className="auth__closeContainer">
            <IconButton onClick={() => setShowGuestInfo(false)}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>}
      </div >
  )
}