import { useEffect } from 'react'
import imgUrl from '../assets/quickdream.webp'
import { Link } from 'react-router-dom'

export default function Header ({ user, handleLogout }){
    const logout = (() => {
        fetch("http://localhost:4000/auth/logout", {
          method: "POST",
          credentials: "include"
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .then(handleLogout())
        .catch(error => console.error(error));
      });

    return(
        <header>
            <img src={imgUrl} alt="Quickdream" />
            <nav>
                <ul>
                    {user && <li><span>Hello, <Link to="/profile">{user.username}</Link></span></li>}
                    <li></li>
                    <li></li>
                    {user ? <li><button onClick={logout}>Logout</button></li> : <li><Link to="auth">Log in / Sign up</Link></li>}
                </ul>
            </nav>
        </header>
    )
}