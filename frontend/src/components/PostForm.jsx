import { useEffect } from 'react';
import { useState } from 'react'
import apiUrl from '../api';
import { TextField, Button, Dialog, IconButton } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import Filter from 'bad-words'
import CloseIcon from '@mui/icons-material/Close';

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

const titleValidationCharacters = `"abcdefghijklmnopqrstuvwxyz1234567890 -`.split("")
const promptValidationCharacters = `"abcdefghijklmnopqrstuvwxyz1234567890 -.!?'",&`.split("")


export default function PostForm({ loggedInUser, onCreatePost, showForm, close }) {
    const [title, setTitle] = useState('')
    const [prompt, setPrompt] = useState('')
    const [formErrors, setFormErrors] = useState([])
    const [placeholder, setPlaceholder] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showDisclaimer, setShowDisclaimer] = useState(false)

    useEffect(() => {
        setPlaceholder(getRandomPlaceholder())
    }, [])

    useEffect(() => {
        let timeout;
        if (isLoading) {
            timeout = setTimeout(() => {
                setShowDisclaimer(true);
            }, 3000);
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [isLoading]);

    const createPost = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${apiUrl}/api/post/create`, {
                method: "POST",
                body: JSON.stringify({
                    title: title,
                    prompt: prompt
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${loggedInUser.token}`
                },
            })

            const data = await response.json()

            if (!response.ok) {
                throw Error(data.error)
            }

            onCreatePost(data)
            setIsLoading(false)
            setShowDisclaimer(false)
        } catch (err) {
            console.error(err)
        }
    }

    const handleClick = e => {

        //Validation
        let filter = new Filter()
        let errors = []
        if (title.length < 3) {
            errors.push("Title should be at least 3 characters long.")
        }
        if (title.length > 32) {
            errors.push("Title should not exceed 32 characters in length.")
        }

        if (filter.isProfane(title)) {
            errors.push("Profane language detected in title. Try another one.")
        }
        if (title.split("").filter(char => !titleValidationCharacters.includes(char.toLowerCase())).length) {
            errors.push("Title should only contain alphanumeric characters and hyphens.")
        }
        if (prompt.length < 3) {
            errors.push("Prompt should be at least 3 characters long.")
        }
        if (prompt.split("").filter(char => !promptValidationCharacters.includes(char.toLowerCase())).length) {
            errors.push("Prompt should only contain alphanumeric and allowed characters (i.e.: A-z 0-9 . , ' \" ? ! & -).")
        }
        if (filter.isProfane(prompt)) {
            errors.push("OpenAI would not let this prompt through due to the language used, so I'm not going to waste my precious credits on it.")
        }

        if (errors.length) {
            setFormErrors(errors)
        } else if (loggedInUser) {
            createPost()
        } else {
            console.log(errors, `User is: ${loggedInUser}`)
        }
    }

    const handleClose = (event, reason) => {
        close()
    }

    return (
        <Dialog open={showForm} onClose={handleClose} sx={{ display: "relative" }}>
            <div className="postForm__closeContainer">
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </div>
            <form className="postForm">
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
                    helperText={formErrors.filter(error => error.toLowerCase().includes("title"))}
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
                    onChange={e => setPrompt(e.target.value)}
                    helperText={formErrors.filter(error => error.toLowerCase().includes("prompt"))}
                />
                <div className="postForm__bottomContainer">
                    <LoadingButton
                        sx={isLoading ? {} : { fontWeight: 'bold' }}
                        loading={isLoading}
                        loadingPosition="start"
                        size="large"
                        fontSize="inherit"
                        variant="contained"
                        onClick={(e) => handleClick()}
                    >
                        {isLoading ? "Dreaming" : "Dream"}
                    </LoadingButton>
                    <p className={showDisclaimer ? "postForm__loadingDisclaimer postForm__loadingDisclaimer--visible" : "postForm__loadingDisclaimer"}>This may take a little bit...</p>
                </div>
            </form>
        </Dialog>
    )
}