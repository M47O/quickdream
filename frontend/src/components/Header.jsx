import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button, Avatar, useMediaQuery, Divider } from '@mui/material'
import { Logout as LogoutIcon, Menu as MenuIcon, Home as HomeIcon, DynamicFeed as DynamicFeedIcon } from '@mui/icons-material/';
import MobileMenu from '../components/MobileMenu'
import "./css/Header.css"

export default function Header({ loggedInUser, handleLogout }) {
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()
    const activePage = location.pathname
    const matches = useMediaQuery('(max-width:640px)')

    const logout = async () => {
        handleLogout();
        navigate("/")
    };

    return (
        <header className='header'>
            <Link className="header__logo" to="/"><span>QD</span></Link>
            <nav className="header__nav">
                {matches ? (
                    <Button
                        onClick={() => setShowMobileMenu(true)}
                        sx={{ marginRight: '5px' }}
                        size="large"
                        variant="contained">
                        <MenuIcon />
                    </Button>
                ) : (
                    /* ---- NAV LINKS ---- */
                    <ul className="header__list">
                        <li className={activePage === '/' ? 'header__activePage' : ''}>
                            <Link to="/">Home <HomeIcon /></Link>
                        </li>
                        <li className={activePage === '/feed' ? 'header__activePage' : ''}>
                            <Link to="/feed">Feed <DynamicFeedIcon sx={{ marginLeft: "3px" }} /></Link>
                        </li>
                        {loggedInUser && <li>
                            <Link
                                className={activePage === '/profile' ? "header__activePage header__profile" : "header__profile"}
                                to="/profile">
                                {loggedInUser.username}
                                <Avatar sx={{ border: '2px solid lightgray', boxShadow: 'inset 0 0 0 1px hsla(0,0%,0%,.75)' }} alt="My profile" src={loggedInUser.avatar} />
                            </Link></li>}
                        {loggedInUser ? (
                            <li>
                                <Button
                                    size="large"
                                    fontSize="inherit"
                                    variant="outlined"
                                    endIcon={<LogoutIcon />}
                                    onClick={logout}>
                                    logout
                                </Button>
                            </li>
                        ) : (
                            <li>
                                <Link
                                    className="header__logout"
                                    style={{ textDecoration: 'none' }}
                                    to='/auth'>
                                    <Button
                                        size="large"
                                        fontSize="inherit"
                                        variant="contained">
                                        Sign up / Log in
                                    </Button>
                                </Link>
                            </li>
                        )}
                    </ul>
                )}

            </nav>
            <MobileMenu
                loggedInUser={loggedInUser}
                handleLogout={handleLogout}
                isOpen={showMobileMenu}
                close={() => setShowMobileMenu(false)}
            />
        </header >
    )

}