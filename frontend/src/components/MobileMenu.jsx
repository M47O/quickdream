import { Link, useLocation } from 'react-router-dom'
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Button, Divider } from '@mui/material'
import { Logout as LogoutIcon, Menu as MenuIcon, Home as HomeIcon, Person2 } from '@mui/icons-material/';
import Person2Icon from '@mui/icons-material/Person2';
import './css/MobileMenu.css'

export default function MobileMenu({ loggedInUser, close, isOpen, handleLogout }) {
    const location = useLocation()
    const activePage = location.pathname

    return (
        <Drawer
            open={isOpen}
            anchor="right"
            onClose={close}
        >
            <List>
                {!loggedInUser &&
                    <Link onClick={close}
                        style={{ textDecoration: 'none' }}
                        to='/auth'>
                        <Button
                            sx={{ margin: '10px 20px' }}
                            size="large"
                            fontSize="inherit"
                            variant="outlined">
                            Sign up / Log in
                        </Button>
                    </Link>
                }

                {loggedInUser &&
                    <ListItem
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <ListItemText>
                            {loggedInUser.username}
                        </ListItemText>
                    </ListItem>
                }

                <Divider />

                <ListItem onClick={close}>
                    <ListItemIcon sx={{ display: 'flex', alignItems: 'center' }}>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText>
                        <Link to="/" className="mobileMenu__link">Home</Link>
                    </ListItemText>
                </ListItem>
                {loggedInUser &&
                    <ListItem onClick={close}>
                        <ListItemIcon sx={{ display: 'flex', alignItems: 'center' }}>
                            <Person2 />
                        </ListItemIcon>
                        <ListItemText>
                            <Link to="/profile" className="mobileMenu__link">Profile</Link>
                        </ListItemText>
                    </ListItem>
                }
                {loggedInUser &&
                    <Link
                        onClick={() => {
                            handleLogout()
                            close()
                        }}
                        style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}
                        to='/'>
                        <Button
                            sx={{ marginTop: '40px' }}
                            size="large"
                            fontSize="inherit"
                            variant="contained">
                            Logout
                        </Button>
                    </Link>
                }

            </List>
        </Drawer >
    )
}