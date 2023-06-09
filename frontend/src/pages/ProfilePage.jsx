import { useEffect, useState } from 'react'
import apiUrl from '../api'
import PostForm from '../components/PostForm'
import PreviewPostDialog from '../components/PreviewPostDialog'
import SelectedPostDialog from '../components/SelectedPostDialog'
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import './css/ProfilePage.css'
import './css/PostGrid.css'

export default function ProfilePage({ loggedInUser }) {
    const [showPreview, setShowPreview] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [post, setPost] = useState(null)
    const [profilePosts, setProfilePosts] = useState([])
    const [selectedPost, setSelectedPost] = useState(null)
    const [showSelectedPost, setShowSelectedPost] = useState(false)

    const handleCreatePost = (newPost) => {
        setPost(newPost)
        setShowPreview(true)
    }

    async function fetchPosts() {
        try {
            if (loggedInUser) {
                const response = await fetch(`${apiUrl}/api/post/user/${loggedInUser.id}`);
                const profilePostsData = await response.json();
                setProfilePosts(profilePostsData)
            }
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchPosts();
    }, [loggedInUser]);

    return (
        !loggedInUser ? <p style={{ textAlign: "center" }}>Please log in to access your profile page.</p> : (
            <div className="profile">
                {showForm &&
                    <PostForm
                        loggedInUser={loggedInUser}
                        onCreatePost={handleCreatePost}
                        showForm={showForm}
                        close={() => {
                            setShowForm(false)
                        }}
                    />}

                <PreviewPostDialog
                    isOpen={showPreview}
                    post={post}
                    updatePosts={fetchPosts}
                    loggedInUser={loggedInUser}
                    close={() => {
                        setShowPreview(false)
                        setPost(null)
                        setShowForm(false)
                    }}
                />
                <section className="profilePosts">
                    <div className="profilePosts__iconContainer">
                        <IconButton
                            size="large"
                            onClick={() => setShowForm(true)}
                        >
                            <AddIcon sx={{ color: 'inherit' }} />
                        </IconButton>
                    </div>

                    <h2 className="profilePosts__heading">My Posts</h2>
                    {profilePosts.length > 0 ? (

                        <div className="postGrid">
                            {profilePosts.map(post => (
                                <div key={post._id}
                                    className="postGrid__imageContainer"
                                    onClick={() => {
                                        setSelectedPost(post)
                                        setShowSelectedPost(true)
                                    }}
                                >

                                    <img
                                        className="postGrid__image"
                                        src={post.image}
                                        alt={`Image generated by AI with the prompt ${post.prompt}`}
                                    />
                                    <div className="postGrid__titleContainer">
                                        <p className="postGrid__imageTitle">{post.title.length > 26 ? post.title.slice(0, 20) + "..." : post.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) :
                        <p className="profilePosts__noPostMessage">You don't have any posts! <br />Click the <b>plus</b> in the top left to generate your first image! </p>
                    }

                    <SelectedPostDialog
                        close={() => setShowSelectedPost(false)}
                        post={selectedPost}
                        isOpen={showSelectedPost}
                        author={loggedInUser}
                        loggedInUser={loggedInUser}
                        profilePosts={profilePosts}
                        setProfilePosts={setProfilePosts}
                    />
                </section >

            </div >

        )
    )
}