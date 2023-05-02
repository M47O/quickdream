import { Link } from 'react-router-dom'
import imgUrl from '../assets/blobanimation.svg'
import { Button } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import './css/HomePage.css'

export default function HomePage({ user }) {
    return (
        <>
            <section className="about">
                <div className="about__taglineContainer">
                    <img className="about__blob" src={imgUrl} />
                    <h3 className="about__tagline">
                        <span className="about__tagline--line1">Dream.</span><br />
                        <span className="about__tagline--line2">Create.</span><br />
                        <span className="about__tagline--line3">Share.</span>
                    </h3>
                </div>
                <div className="about__info">
                    <div className="about__text">
                        <h2 className="about__heading">What is Quickdream?</h2>
                        <p className="about__paragraph">Quickdream is a social media platform that allows users to create and share unique images created by DALL-E, an AI language model developed by OpenAI. Users simply enter a prompt, such as <b>"a flamingo riding a bicycle on the moon,"</b> and DALL-E generates an original image based on that prompt. These images can then be shared on the Quickdream platform, where users can follow each other, like and comment on images, and discover new and interesting prompts to try. With Quickdream, users can explore the creative potential of AI and share their own unique visions with the world.</p>
                    </div>
                    {user ? <Link className="about__button" style={{ textDecoration: 'none' }} to='/profile'><Button size="large" fontSize="inherit" variant="contained">Create</Button></Link>
                        : <Link className="about__button" style={{ textDecoration: 'none' }} to='/auth'><Button size="large" fontSize="inherit" variant="contained">Sign up / Log in</Button></Link>}
                </div>
            </section>

            <section className="showcase">
                Sample Images
            </section>
        </>
    )
}