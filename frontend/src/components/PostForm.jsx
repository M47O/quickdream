import { useEffect } from 'react';
import { useState } from 'react'
import { TextField, Button } from '@mui/material'
import './css/PostForm.css'


const placeholderPrompts = [
    "A mermaid lounging on a beach towel with a cocktail in hand.",
    "A bicycle made entirely out of fruit.",
    "A city skyline at night, with the buildings made of jelly.",
    "A treehouse in the shape of a giant teapot.",
    "A superhero team made up entirely of household pets.",
    "A hot air balloon shaped like a giant birthday cake.",
    "A garden filled with flowers that resemble different types of candies.",
    "A futuristic kitchen with appliances that are powered by plants.",
    "A rainbow colored dragon curled up on a bed of clouds.",
    "An underwater world with a castle made entirely out of coral.",
    "A surreal landscape with a mountain range made of stacked books."
]

function getRandomPlaceholder() {
    return placeholderPrompts[Math.floor(Math.random() * placeholderPrompts.length)];
}

const validationCharacters = `"abcdefghijklmnopqrstuvwxyz1234567890 .!?'"`.split("")

export default function PostForm({ user }) {
    const [title, setTitle] = useState('')
    const [prompt, setPrompt] = useState('')
    const [formErrors, setFormErrors] = useState([])
    const [placeholder, setPlaceholder] = useState("")

    useEffect(() => {
        setPlaceholder(getRandomPlaceholder())
    }, [])


    const createPost = () => {
        fetch("http://localhost:4000/post/create", {
            method: "POST",
            body: JSON.stringify({
                title: title,
                prompt: prompt
            }),
            headers: {
                "Content-type": "application/json",
            },
            credentials: "include"
        })
    }

    const handleClick = e => {

        //Validation
        let errors = []
        if (title.length < 3) {
            errors.push("Title should be at least 3 characters long.")
        }
        if (title.split("").filter(char => !validationCharacters.includes(char.toLowerCase())).length) {
            errors.push("Title should only include alphanumeric characters.")
        }
        if (prompt.length < 3) {
            errors.push("Prompt should be at least 3 characters long.")
        }
        if (prompt.split("").filter(char => !validationCharacters.includes(char.toLowerCase())).length) {
            errors.push("Prompt should only include alphanumeric characters.")
        }

        if (errors.length) {
            setFormErrors(errors)
        } else if (user) {
            createPost()
        } else {
            console.log(errors, user)
        }
    }

    return (
        <form className="post__form">
            <TextField
                id="title"
                name="title"
                label="Title"
                placeholder="My awesome idea"
                value={title}
                variant="outlined"
                color="secondary"
                autoFocus={true}
                onChange={e => setTitle(e.target.value)}
                helperText={formErrors.filter(error => error.includes("Title"))}
            />
            <TextField
                id="prompt"
                name="prompt"
                label="Prompt"
                placeholder={placeholder}
                value={prompt}
                variant="outlined"
                color="secondary"
                multiline
                autoFocus={true}
                onChange={e => setTitle(e.target.value)}
                helperText={formErrors.filter(error => error.includes("Prompt"))}
            />
            <Button
                size="large"
                fontSize="inherit"
                variant="contained"
                onClick={(e) => handleClick()}
            >
                Dream
            </Button>
            {/* <button onClick={(e) => {
                    e.preventDefault()
                    handleClick()
                }}
                >Create</button> */}
        </form>
    )
}