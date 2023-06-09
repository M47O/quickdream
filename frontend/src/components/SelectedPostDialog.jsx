import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import apiUrl from '../api'
import { Dialog, DialogTitle, DialogContent, IconButton, Divider, Button } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import MenuIcon from '@mui/icons-material/Menu'
import './css/PostDialog.css'

export default function SelectedPostDialog({ isOpen, post, close, loggedInUser, author, displayedPosts, setDisplayedPosts }) {
    const [isLiked, setIsLiked] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [showPrompt, setShowPrompt] = useState(false)
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)

    const params = useParams()

    useEffect(() => {
        if (post && post.likedBy.includes(loggedInUser.id)) {
            setIsLiked(true)
        }
    }, [[post]])

    const handleLike = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/post/like`, {
                method: "PUT",
                body: JSON.stringify({
                    id: post._id,
                    liker: loggedInUser.id
                }),
                headers: {
                    "Content-type": "application/json",
                },
            })

            setIsLiked(true)
            post.likes += 1
        } catch (err) {
            console.error('Error liking post: ', err)
        }
    }

    const handleUnlike = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/post/unlike`, {
                method: "PUT",
                body: JSON.stringify({
                    id: post._id,
                    liker: loggedInUser.id
                }),
                headers: {
                    "Content-type": "application/json",
                },
            })

            setIsLiked(false)
            post.likes -= 1

            post.likedBy = post.likedBy.filter(liker => liker !== loggedInUser.id)
        } catch (err) {
            console.error('Error unliking post: ', err)
        }
    }

    const handleDelete = async () => {
        try {
            const response = fetch(`${apiUrl}/api/post/delete`, {
                method: "DELETE",
                body: JSON.stringify({
                    id: post._id
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${loggedInUser.token}`,
                },
            })

            close()
            setDisplayedPosts(displayedPosts.filter(p => p._id !== post._id))
        } catch (err) {
            console.error("Error deleting post: ", err)
        }
    }

    const handleShowPrompt = (e) => {
        e.preventDefault()
        setShowPrompt(true)
        setTimeout(() => setShowPrompt(false), 6000)
    }

    return (
        post && (
            <Dialog
                open={isOpen}
                onClose={() => {
                    close()
                    setShowMenu(false)
                }}
            >
                <DialogTitle
                    fontWeight="bold">
                    {post.title}
                </DialogTitle>
                <div className="selectedDialog__menuButton selectedDialog__menuButton--mobile">
                    <IconButton size="small" onClick={() => setShowMenu(!showMenu)}>
                        <MenuIcon sx={{ color: "white" }} />
                    </IconButton>
                </div>
                <DialogContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        paddingTop: '0'
                    }}>
                    <div className="selectedDialog__imageContainer" onClick={(e) => {
                        if (e.target.classList.contains("selectedDialog__menuButton")) {
                            return;
                        }
                        setShowMenu(false);
                    }}>
                        <div className="selectedDialog__menuButton">
                            <IconButton size="small" onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setShowMenu(!showMenu)
                            }}>
                                <MenuIcon sx={{ color: "white" }} />
                            </IconButton>
                        </div>

                        {/* Menu */}
                        {showMenu && (
                            <div className="selectedDialog__menu">
                                <ul className="selectedDialog__menuItems">
                                    <li>
                                        <Button onClick={(e) => {
                                            handleShowPrompt(e)
                                            setShowMenu(false)
                                        }}
                                        >
                                            View prompt
                                        </Button>
                                    </li>
                                    <Divider className="selectedDialog__menuDivider" />

                                    {author.id === loggedInUser.id && (
                                        <li>
                                            <Button variant="outlined" color="error" onClick={(e) => {
                                                setShowConfirmDelete(true)
                                                setShowMenu(false)
                                            }}
                                            >
                                                Delete
                                            </Button>
                                        </li>
                                    )}
                                    <li>
                                        <p className="selectedDialog__menuTooltip">Click anywhere inside the image to close this menu.</p>
                                    </li>
                                </ul>
                            </div>
                        )}
                        {/* End of Menu */}
                        <img className="selectedDialog__image" src={post.image} alt={post.prompt} />
                        {showPrompt && <p className="selectedDialog__prompt">{post.prompt}</p>}
                        {showConfirmDelete && (
                            <div className="selectedDialog__confirmDelete">
                                <p>Are you sure you want to delete this post:<br /><b>{post.title}</b>?</p>
                                <div className="confirmDelete__buttonContainer">

                                    <Button variant="outlined" color="error" onClick={(e) => {
                                        handleDelete()
                                        setShowConfirmDelete(false)
                                    }}
                                    >
                                        Yes, delete this post
                                    </Button>
                                    <Button variant="contained" onClick={(e) => {
                                        setShowConfirmDelete(false)
                                    }}
                                    >
                                        No, keep this post
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="selectedDialog__info">
                        <Link
                            to={`/profile/${author.id}`}
                            onClick={params.id == author.id ? close : ""}
                        >
                            {author.username}
                        </Link>
                        <div className="selectedDialog__likesContainer">
                            <IconButton onClick={isLiked ? handleUnlike : handleLike}>
                                {isLiked ? <FavoriteIcon sx={{ color: 'red' }} /> : <FavoriteBorderIcon sx={{ color: 'red' }} />}
                            </IconButton>
                            <span>{post.likes}</span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog >
        )
    )
}