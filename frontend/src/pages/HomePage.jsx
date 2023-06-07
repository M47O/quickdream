import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiUrl from '../api'
import imgUrl from '../assets/blobanimation.svg'
import arrow from '../assets/arrow.webp'
import { Button, Icon } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SelectedPostDialog from '../components/SelectedPostDialog'
import FavoriteIcon from '@mui/icons-material/Favorite'
import './css/HomePage.css'

export default function HomePage({ loggedInUser }) {
    const [mostLiked, setMostLiked] = useState([])
    const [mostRecent, setMostRecent] = useState([])
    const [selectedPost, setSelectedPost] = useState(null)
    const [showSelectedPost, setShowSelectedPost] = useState(false)

    useEffect(() => {
        const getSuperlatives = async () => {
            const response = await fetch(`${apiUrl}/api/post/superlatives`)
            const data = await response.json()
            const { mostLikedPosts, mostRecentPosts } = data
            setMostLiked(mostLikedPosts)
            setMostRecent(mostRecentPosts)
        }
        getSuperlatives()
    }, [])

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
                    {loggedInUser ? <Link className="about__button" style={{ textDecoration: 'none' }} to='/profile'><Button size="large" fontSize="inherit" variant="contained">Create</Button></Link>
                        : <Link className="about__button" style={{ textDecoration: 'none' }} to='/auth'><Button size="large" fontSize="inherit" variant="contained">Sign up / Log in</Button></Link>}
                    {!loggedInUser && (
                        <div className="about__disclaimerContainer">
                            <img className="about__arrow" src={arrow} />
                            <p className="about__disclaimer">Don't want to sign up?<br />A guest account is available!</p>
                        </div>
                    )}
                </div>
            </section>

            <section className="showcase">
                <div className="showcase__group">
                    <p className="showcase__groupTitle">Most Liked Posts</p>
                    {mostLiked.map(post => (
                        <div key={post._id} className="showcase__imageContainer">
                            <img
                                className="showcase__image"
                                src={post.image}
                                alt={`Image generated by AI with the prompt ${post.prompt}`}
                            />
                            <div className="showcase__infoContainer">
                                <div className="showcase__titleAuthor">
                                    <p className="showcase__imageTitle">{post.title.length > 26 ? post.title.slice(0, 20) + "..." : post.title}</p>
                                    <Link className="showcase__viewAuthor" to={`/profile/${post.author}`}>View author »</Link>
                                </div>
                                <div className="showcase__likesContainer">
                                    <Icon><FavoriteIcon sx={{ color: 'red' }} /></Icon>
                                    <p>{post.likes}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="showcase__group">
                    <p className="showcase__groupTitle">Most Recent Posts</p>
                    {mostRecent.map(post => (
                        <div key={post._id} className="showcase__imageContainer">
                            <img
                                className="showcase__image"
                                src={post.image}
                                alt={`Image generated by AI with the prompt ${post.prompt}`}
                            />
                            <div className="showcase__infoContainer">
                                <div className="showcase__titleAuthor">
                                    <p className="showcase__imageTitle">{post.title.length > 26 ? post.title.slice(0, 20) + "..." : post.title}</p>
                                    <Link className="showcase__viewAuthor" to={`/profile/${post.author}`}>View author »</Link>
                                </div>
                                <div className="showcase__likesContainer">
                                    <Icon><FavoriteIcon sx={{ color: 'red' }} /></Icon>
                                    <p>{post.likes}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}