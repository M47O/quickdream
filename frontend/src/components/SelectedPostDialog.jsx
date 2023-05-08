import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import './css/PostDialog.css'

export default function SelectedPostDialog({ isOpen, post, close, loggedInUser, author }) {
    let [isLiked, setIsLiked] = useState(false)

    const params = useParams()

    useEffect(() => {
        if (post && post.likedBy.includes(loggedInUser.id)) {
            setIsLiked(true)
        }
    })

    const handleLike = async () => {
        try {
            const response = await fetch("http://localhost:4000/post/like", {
                method: "PUT",
                body: JSON.stringify({
                    id: post._id,
                    liker: loggedInUser.id
                }),
                headers: {
                    "Content-type": "application/json",
                },
                credentials: "include"
            })

            setIsLiked(true)
            post.likes += 1
        } catch (err) {
            console.error('Error liking post: ', err)
        }
    }

    const handleUnlike = async () => {
        try {
            const response = fetch("http://localhost:4000/post/unlike", {
                method: "PUT",
                body: JSON.stringify({
                    id: post._id,
                    liker: loggedInUser.id
                }),
                headers: {
                    "Content-type": "application/json",
                },
                credentials: "include"
            })

            setIsLiked(false)
            post.likes -= 1
        } catch (err) {
            console.error('Error unliking post: ', err)
        }
    }

    const handleDelete = async () => {
        try {
            const response = fetch("http://localhost:4000/post/delete", {
                method: "DELETE",
                body: JSON.stringify({
                    id: post._id
                }),
                headers: {
                    "Content-type": "application/json",
                },
                credentials: "include"
            })

            close()
        } catch (err) {
            console.err("Error deleting post: ", err)
        }
    }

    return (
        post && (
            <Dialog
                open={isOpen}
                onClose={close}
            >
                <DialogTitle
                    fontWeight="bold">
                    {post.title}
                </DialogTitle>
                <DialogContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                    <div className="selectedDialog__imageContainer">
                        <div className="selected_Dialog__menuButton"></div>
                        <img className="selectedDialog__image" src={post.image} alt={post.prompt} />
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
                    <p className="selectedDialog__prompt">{post.prompt}</p>
                </DialogContent>
            </Dialog >
        )
    )
}