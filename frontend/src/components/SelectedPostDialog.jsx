import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import apiUrl from '../api'
import { Dialog, DialogTitle, DialogContent, IconButton, Divider, Button } from '@mui/material'
import CommentsSection from './CommentsSection'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import MenuIcon from '@mui/icons-material/Menu'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import './css/PostDialog.css'

export default function SelectedPostDialog({ isOpen, post, close, loggedInUser, author, displayedPosts, setDisplayedPosts, bookmarkedPosts, likedPosts, allPosts, updateBookmarkedPosts, updateLikedPosts, updateAllPosts }) {
    const [isLiked, setIsLiked] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [showPrompt, setShowPrompt] = useState(false)
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const [postComments, setPostComments] = useState(null)

    const params = useParams()

    useEffect(() => {
        if (post && post.likedBy.includes(loggedInUser.id)) {
            setIsLiked(true)
        }

        if (post && post.bookmarkedBy.includes(loggedInUser.id)) {
            setIsBookmarked(true)
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
            post.likedBy = [...post.likedBy, loggedInUser.id]

            if (allPosts) {
                //Update allPosts
                const postIndex = allPosts.findIndex(p => p._id === post._id);
                const updatedPosts = [...allPosts];
                updatedPosts[postIndex] = post;
                updateAllPosts(updatedPosts);
            }

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

            if (allPosts) {
                //Update allPosts
                const postIndex = allPosts.findIndex(p => p._id === post._id);
                const updatedPosts = [...allPosts];
                updatedPosts[postIndex] = post;
                updateAllPosts(updatedPosts);
            }
        } catch (err) {
            console.error('Error unliking post: ', err)
        }
    }

    const handleBookmark = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/post/bookmark`, {
                method: "PUT",
                body: JSON.stringify({
                    id: post._id,
                    bookmarker: loggedInUser.id
                }),
                headers: {
                    "Content-type": "application/json",
                },
            })
            setIsBookmarked(true)

            if (allPosts) {
                //Update allPosts
                post.bookmarkedBy = [post.bookmarkedBy, loggedInUser.id]
                const postIndex = allPosts.findIndex(p => p._id === post._id);
                const updatedPosts = [...allPosts];
                updatedPosts[postIndex] = post;
                updateAllPosts(updatedPosts);
            }

        } catch (err) {
            console.error('Error bookmarking post: ', err)
        }
    }

    const handleUnbookmark = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/post/unbookmark`, {
                method: "PUT",
                body: JSON.stringify({
                    id: post._id,
                    bookmarker: loggedInUser.id
                }),
                headers: {
                    "Content-type": "application/json",
                },
            })

            setIsBookmarked(false)

            if (allPosts) {
                post.bookmarkedBy = post.bookmarkedBy.filter(id => id !== loggedInUser.id)
                //Update allPosts
                const postIndex = allPosts.findIndex(p => p._id === post._id);
                const updatedPosts = [...allPosts];
                updatedPosts[postIndex] = post;
                updateAllPosts(updatedPosts);
            }

        } catch (err) {
            console.error('Error unboomarking post: ', err)
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

            const deleteComments = fetch(`${apiUrl}/api/comment/deletePost`, {
                method: "DELETE",
                body: JSON.stringify({
                    post: post._id
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

    const fetchComments = async () => {
        if (postComments === null) {
            try {
                const response = await fetch(`${apiUrl}/api/comment/${post._id}`)
                const allComments = await response.json()
                setPostComments(allComments)
            } catch (err) {
                console.error("Error fetching comments: ", err)
            }
        }
    }

    return (
        post && (
            <Dialog
                open={isOpen}
                onClose={() => {
                    close()
                    setShowMenu(false)
                    setIsLiked(false)
                    setIsBookmarked(false)
                    setShowComments(false)
                    setPostComments(null)
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
                        <div className="selectedDialog__infoRight">
                            <IconButton onClick={() => {
                                fetchComments()
                                setShowComments(prevShowComments => !prevShowComments)
                            }}>
                                {showComments ? <ChatBubbleIcon style={{ color: "var(--color-font-primary)" }} /> : <ChatBubbleOutlineIcon style={{ color: "var(--color-font-primary)" }} />}
                            </IconButton>
                            <div className="selectedDialog__likesContainer">
                                <IconButton onClick={isLiked ? handleUnlike : handleLike}>
                                    {isLiked ? <FavoriteIcon sx={{ color: 'red' }} /> : <FavoriteBorderIcon sx={{ color: 'red' }} />}
                                </IconButton>
                                <span>{post.likes}</span>
                            </div>
                            <IconButton onClick={isBookmarked ? handleUnbookmark : handleBookmark}>
                                {isBookmarked ? <BookmarkIcon style={{ color: "var(--color-font-primary)" }} /> : <BookmarkBorderIcon style={{ color: "var(--color-font-primary)" }} />}
                            </IconButton>
                        </div>
                    </div>

                    {showComments && (
                        <CommentsSection
                            comments={postComments}
                            post={post}
                            setComments={setPostComments}
                            loggedInUser={loggedInUser}
                            close={close}
                        />
                    )}
                </DialogContent>
            </Dialog >
        )
    )
}