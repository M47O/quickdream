import { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button, Avatar, Drawer, useMediaQuery } from '@mui/material'
import { Logout as LogoutIcon, Menu as MenuIcon, Home as HomeIcon } from '@mui/icons-material/';
import "./css/Header.css"

export default function Header({ user, handleLogout }) {
    const navigate = useNavigate()
    const location = useLocation()
    const activePage = location.pathname
    const matches = useMediaQuery('(max-width:640px)')

    // console.log(location)

    const logout = async () => {
        try {
            const response = await fetch("http://localhost:4000/auth/logout", {
                method: "POST",
                credentials: "include"
            });
            const data = await response.json();
            console.log(data);
            handleLogout();
            navigate("/")
        } catch (error) {
            console.error(error);
        }
    };


    //Give active page class of header__activePage
    return (
        <header className='header'>
            <Link className="header__logo" to="/"><span>QD</span></Link>
            <nav className="header__nav">
                {matches ? (
                    <Button sx={{ marginRight: '5px' }} size="large" variant="contained"><MenuIcon /></Button>
                ) : (
                    <ul className="header__list">
                        <li className={activePage === '/' ? 'header__activePage' : ''}>
                            <Link to="/">Home <HomeIcon /></Link>
                        </li>
                        {user && <li>
                            <Link
                                className={activePage === '/profile' ? "header__activePage header__profile" : "header__profile"}
                                to="/profile">
                                {user.username}
                                <Avatar sx={{ border: '2px solid lightgray', boxShadow: 'inset 0 0 0 1px hsla(0,0%,0%,.75)' }} alt="My profile" src={user.avatar} />
                            </Link></li>}
                        {user ? (
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
        </header>
    )

}