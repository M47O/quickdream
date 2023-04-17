import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthPage({ handleLogin }){
    const [isLogin, setIsLogin] = useState(true)
    const [username, setUsername] = useState('') 
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    
    const navigate = useNavigate()

    const login = () => {
      fetch("http://localhost:4000/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password
        }),
        headers: {
          "Content-type": "application/json",
          },
        credentials: "include"
      })
      .then(response => response.json())
      .then(data => handleLogin({username: data.username, id: data._id}))
      .then(navigate("/"))
      .catch(error => console.error(error));
      };

    const register = () => {
      fetch("http://localhost:4000/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password
        }),
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include"
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
      }

    return (
        <>
        <button style={{width: "100px", textAlign: "center"}} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign up" : "Login"}
        </button>
        <form>
            <label htmlFor="username">Username</label>
            <input placeholder="username" id="username" onChange={e => setUsername(e.target.value)}/>
            
            <label htmlFor="password">Password</label>
            <input type="password" placeholder="password" id="password" onChange={e => setPassword(e.target.value)}/>
            {!isLogin && (
                <>
                <label htmlFor="confirmPassword">Confirm password</label>
                <input type="password" placeholder="Confirm password" id="confirmPassword" onChange={e => setConfirmPassword(e.target.value)}/>
                </>
            )}
          <button onClick={(e) => {
            e.preventDefault()
            isLogin ? login() : register()
          }}
          >
            {isLogin ? "Log in" : "Sign up"}</button>
        </form>
        </>
    )
}