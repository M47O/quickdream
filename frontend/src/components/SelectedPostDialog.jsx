import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import './css/PostDialog.css'

export default function SelectedPostDialog({ isOpen, post, close, user }) {

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
            console.err(err)
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
                        <p>{post.author}</p>
                    </div>
                    <p className="selectedDialog__prompt">{post.prompt}</p>
                </DialogContent>

            </Dialog>
        )
    )
}