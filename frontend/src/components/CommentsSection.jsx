import { useState } from 'react'
import apiUrl from '../api'
import { Button, TextField, InputAdornment } from '@mui/material'
import Comment from './Comment.jsx'
import AddCommentIcon from '@mui/icons-material/AddComment'
import AddCommentIconOutlined from '@mui/icons-material/AddComment'
import './css/CommentsSection.css'

export default function CommentsSection({ comments, post, setComments, loggedInUser, close }) {
    const [showNewComment, setShowNewComment] = useState(false)
    const [newComment, setNewComment] = useState('')

    const createComment = async () => {
        if (newComment.length > 0 && newComment.length <= 180) {
            const response = await fetch(`${apiUrl}/api/comment/create`, {
                method: "POST",
                body: JSON.stringify({
                    message: newComment,
                    post: post._id
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${loggedInUser.token}`
                },
            })
            const comment = await response.json()

            setComments(prevComments => [comment, ...prevComments])
            setShowNewComment(false)
            setNewComment('')
        }
    }

    return (
        <section className="commentsSection">
            <Button
                className="commentsSection_newComment"
                variant={showNewComment ? 'outlined' : 'contained'}
                size="small"
                endIcon={!showNewComment && <AddCommentIcon />}
                sx={{ position: 'absolute' }}

                onClick={() => setShowNewComment(prevShowNewComment => !prevShowNewComment)}
            >
                {showNewComment ? 'Hide comment form' : 'New comment'}
            </Button>
            {comments && !comments.length && !showNewComment && <p className="commentsSection__noCommentsDisclaimer">This post doesn't have any comments.<br />Click new comment to be the first to add one!</p>}

            {showNewComment && (
                <form className="commentsSection__commentForm"
                    onSubmit={(e) => {
                        e.preventDefault()
                    }}>
                    <TextField
                        id="comment"
                        name="comment"
                        label="Write a message!"
                        value={newComment}
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        multiline
                        onChange={e => setNewComment(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <span className={newComment.length <= 180 ? "commentsSection__newCommentLength" : "commentsSection__newCommentLength commentsSection__newCommentLength--warning"} >
                                        {`${newComment.length} / 180`}
                                    </span>
                                </InputAdornment>
                            )
                        }} />
                    <Button
                        type="submit"
                        size="large"
                        fontSize="inherit"
                        variant="contained"
                        onClick={createComment}
                    >
                        Submit
                    </Button>
                </form>
            )
            }
            {comments && comments.map(comment => {
                return (
                    <Comment
                        key={comment._id}
                        author={comment.author}
                        createdAt={comment.createdAt}
                        message={comment.message}
                        post={comment.post}
                        id={comment._id}
                        close={close}
                        loggedInUser={loggedInUser}
                        comments={comments}
                        setComments={setComments}
                    />
                )

            })}
        </section >
    )
}