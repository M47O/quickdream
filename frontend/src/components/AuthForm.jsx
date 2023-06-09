import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiUrl from '../api';
import { TextField, InputAdornment, IconButton, Switch, Button } from '@mui/material';
import { AccountCircle, Visibility, VisibilityOff, Login } from '@mui/icons-material';

import './css/AuthForm.css';

export default function AuthForm({ handleLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [validationErrors, setValidationErrors] = useState({
        usernameErrors: [],
        passwordErrors: [],
        confirmPasswordErrors: []
    });
    const navigate = useNavigate()

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const validateOnBlur = (e) => {
        const usernameErrors = [];
        const passwordErrors = [];
        const confirmPasswordErrors = [];
        const allowedCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789._-'.split("");

        // Validate username
        if (e.target.name === 'username') {
            if (!username) {
                usernameErrors.push('Username is required');
            } else if (username.length < 4) {
                usernameErrors.push('Username must be at least 4 characters long');
            } else {
                for (const char of username) {
                    if (!allowedCharacters.includes(char.toLowerCase())) {
                        usernameErrors.push("Please only use alphanumeric characters, periods, underscores, and/or hyphens.");
                    }
                }
            }
            setValidationErrors({ ...validationErrors, usernameErrors })
        }

        // Validate password
        if (e.target.name === 'password') {
            if (!password) {
                passwordErrors.push('Password is required');
            } else if (password.length < 6) {
                passwordErrors.push('Password must be at least 6 characters long');
            }
            setValidationErrors({ ...validationErrors, passwordErrors })
        }

        // Validate confirm password
        if (e.target.name === 'confirmPassword') {
            if (confirmPassword !== password) {
                confirmPasswordErrors.push('Passwords do not match');
            }
            setValidationErrors({ ...validationErrors, confirmPasswordErrors })
        }
    };

    const login = async () => {
        try {
            if (username.length && !validationErrors.usernameErrors.length && !validationErrors.passwordErrors.length) {
                const response = await fetch(`${apiUrl}/api/user/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error)
                } else {
                    //save user to local storage
                    localStorage.setItem('user', JSON.stringify(data))
                }


                handleLogin({ username: data.username, id: data.id, avatar: data.avatar, token: data.token });
                navigate("/profile");
            }
        } catch (error) {
            console.error(error)
            if (String(error).split("Error: ").includes("Incorrect username")) {
                setValidationErrors({
                    ...validationErrors,
                    usernameErrors: ["Incorrect username."]
                })
            }

            if (String(error).split("Error: ").includes("Incorrect password")) {
                setValidationErrors({
                    ...validationErrors,
                    passwordErrors: ["Incorrect password."]
                })
            }
        };
    }

    const register = async () => {
        try {
            if (!validationErrors.usernameErrors.length && !validationErrors.passwordErrors.length && !validationErrors.confirmPasswordErrors.length) {
                const response = await fetch(`${apiUrl}/api/user/signup`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error)
                } else {
                    //save user to local storage
                    localStorage.setItem('user', JSON.stringify(data))
                }

            }
        } catch (error) {
            console.error(error)
            if (String(error).split("Error: ").includes("Username already in use")) {
                setValidationErrors({
                    ...validationErrors,
                    usernameErrors: ["Someone's already using this username. Please try a different one."]
                })
            }
        }
    };

    return (
        <form className="auth__form"
            onSubmit={(e) => {
                e.preventDefault()
                isLogin ? login() : register()
            }}
        >
            <div className="auth__toggle">
                <p className="auth__toggleLabel auth__toggleLabel--left"
                    style={isLogin ? { fontWeight: 'bold' } : {}}
                    onClick={() => {
                        if (!isLogin) {
                            setIsLogin(true)
                        }
                    }}
                >
                    Log in</p>
                <Switch checked={!isLogin} onChange={() => setIsLogin(!isLogin)} />
                <p className="auth__toggleLabel auth__toggleLabel--right"
                    style={isLogin ? {} : { fontWeight: 'bold' }}
                    onClick={() => {
                        if (isLogin) {
                            setIsLogin(false)
                        }
                    }}>
                    Sign up
                </p>
            </div>
            <TextField
                id="username"
                name="username"
                label="Username"
                value={username}
                variant="outlined"
                color="secondary"
                autoFocus={true}
                onChange={e => setUsername(e.target.value)}
                onBlur={e => validateOnBlur(e)}
                helperText={validationErrors.usernameErrors.length ? validationErrors.usernameErrors[0] : ''}
                error={validationErrors.usernameErrors.length > 0}
                InputProps={{
                    startAdornment: (
                        <InputAdornment
                            position="start"
                            sx={{ marginRight: '5px' }}>
                            <AccountCircle fontSize="large" />
                        </InputAdornment>
                    )
                }}
            />
            <TextField
                id="password"
                name="password"
                label="Password"
                value={password}
                type={showPassword ? "text" : "password"}
                variant="outlined"
                color="secondary"
                onChange={e => setPassword(e.target.value)}
                onBlur={e => validateOnBlur(e)}
                error={validationErrors.passwordErrors.length > 0}
                helperText={validationErrors.passwordErrors.length ? validationErrors.passwordErrors[0] : ''}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                edge="start"
                                size="large"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />

            {
                !isLogin &&
                <TextField
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm Password"
                    value={confirmPassword}
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    color="secondary"
                    onChange={e => setConfirmPassword(e.target.value)}
                    onBlur={e => validateOnBlur(e)}
                    error={validationErrors.confirmPasswordErrors.length > 0}
                    helperText={validationErrors.confirmPasswordErrors.length ? validationErrors.confirmPasswordErrors[0] : ''}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    edge="start"
                                    size="large"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            }

            <Button
                type="submit"
                size="large"
                fontSize="inherit"
                variant="contained"
                endIcon={isLogin && <Login />}
            >
                {isLogin ? "Log in" : "Sign up"}
            </Button>
        </form >

    );
}