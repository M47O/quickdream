import { useState } from 'react'
import { Link } from 'react-router-dom'

const placeholderPrompts = [
    "A mermaid lounging on a beach towel with a cocktail in hand.",
    "A bicycle made entirely out of fruit.",
    "A city skyline at night, with the buildings made of jelly.",
    "A treehouse in the shape of a giant teapot.",
    "A superhero team made up entirely of household pets.",
    "A hot air balloon shaped like a giant birthday cake.",
    "A garden filled with flowers that resemble different types of candies.",
    "A futuristic kithen with appliances that are powered by plants.",
    "A rainbow colored dragon curled up on a bed of clouds.",
    "An underwater world with a castle made entirely out of coral.",
    "A surreal landscape with a mountain range made of stacked books."
]

const validationCharacters = "abcdefghijklmnopqrstuvwxyz1234567890".split("")

export default function ProfilePage(){
    const [title, setTitle] = useState('')
    const [prompt, setPrompt] = useState('')

    const createPost = () => {
        fetch("http://localhost:4000/post", {
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
    
    return(
        <>
            <form>
                <label htmlFor="title">Title</label>
                <input placeholder="My Awesome Idea" id="title" />
                <label htmlFor="prompt">Prompt</label>
                <textarea placeholder={placeholderPrompts[Math.floor(Math.random()*placeholderPrompts.length)]} id="title" />
                <button onClick={(e) => {
                    e.preventDefault()
                    if(title.length < 3){
                        //Display error - "Title should be at least 3 characters long."
                    }
                    
                    if(title.split("").filter(char => !validationCharacters.includes(char)).length){
                        //Display error - "Titles should only include alphanumeric characters."
                    }

                    }}
                >Create</button>
            </form>
        </>
    )
}