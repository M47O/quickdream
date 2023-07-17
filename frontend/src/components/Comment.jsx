import { Link, useParams } from 'react-router-dom'
import apiUrl from '../api'
import { Avatar, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import './css/Comment.css'
export default function Comment({ author, createdAt, message, post, id, close, loggedInUser, comments, setComments }) {
    const params = useParams()
    const datePosted = new Date(createdAt).toLocaleDateString()
    const timePosted = new Date(createdAt).toLocaleTimeString()
    const currentDate = new Date().toLocaleDateString()
    console.log(comments)

    const handleDelete = () => {
        try {
            const response = fetch(`${apiUrl}/api/comment/delete`, {
                method: "DELETE",
                body: JSON.stringify({
                    id
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${loggedInUser.token}`,
                },
            })

            setComments(prevComments => prevComments.filter(c => c._id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="comment">
            <div className="comment__user">
                <Avatar sx={{ border: '2px solid lightgray', boxShadow: 'inset 0 0 0 1px hsla(0,0%,0%,.75)', height: 30, width: 30 }} alt="My profile" src={author.avatar} />
                <Link
                    to={`/profile/${author._id}`}
                    onClick={params.id == author.id ? close : ""}
                >
                    {author.username}
                </Link>
            </div>
            <p className="comment__message">
                {message}
            </p>
            <span className="comment__date">{datePosted === currentDate ? timePosted : datePosted}</span>
            {loggedInUser.id === author._id && (
                <div className="comment__deleteContainer">
                    <IconButton
                        onClick={handleDelete}
                        size="small"
                        style={{ color: "var(--color-font-primary)" }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
            )}
        </div>
    )
}