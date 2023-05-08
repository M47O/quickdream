import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import './css/PostDialog.css'

export default function PreviewPostDialog({ isOpen, post, close, updatePosts }) {

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

    const handleKeep = () => {
        updatePosts()
        close()
    }

    return (
        post && (
            <Dialog
                open={isOpen}
                onClose={() => { }}
                disableEscapeKeyDown={true}
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
                    <img className="previewDialog__image" src={post.image} alt={post.prompt} />
                    <p className="previewDialog__prompt">{post.prompt}</p>
                </DialogContent>
                <DialogActions sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingX: '24px;'
                }}>
                    <Button
                        sx={{ width: '100px' }}
                        onClick={handleDelete}
                        variant="outlined"
                        size="large">
                        Discard
                    </Button>
                    <Button
                        sx={{ width: '100px' }}
                        onClick={handleKeep}
                        variant="contained"
                        size="large">
                        Keep
                    </Button>
                </DialogActions>
            </Dialog>
        )
    )
}