import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import apiUrl from '../api'
import SelectedPostDialog from '../components/SelectedPostDialog'
import './css/ProfilePage.css'

export default function ProfileByIdPage({ loggedInUser }) {
    const [requestedUser, setRequestedUser] = useState(null)
    const [showSelctedPost, setShowSelectedPost] = useState(false)
    const [profilePosts, setProfilePosts] = useState([])
    const [selectedPost, setSelectedPost] = useState(null)

    const params = useParams()
    const navigate = useNavigate()

    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/user/userInfo/${params.id}`)
            const data = await response.json()
            setRequestedUser({ username: data.username, id: data._id, avatar: data.avatar })
        } catch (err) {
            console.err(err)
        }

    }

    async function fetchPosts() {
        try {
            if (requestedUser !== null) {
                const response = await fetch(`${apiUrl}/api/post/user/${requestedUser.id}`);
                const profilePostsData = await response.json();
                setProfilePosts(profilePostsData)
            }
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchUserInfo();
    }, [params.id]);

    useEffect(() => {
        if (requestedUser && loggedInUser && (loggedInUser.id === requestedUser.id)) {
            navigate('/profile');
        }

        if (requestedUser) {
            fetchPosts();
        }
    }, [requestedUser, loggedInUser]);

    return (!loggedInUser ? <p style={{ textAlign: "center" }}> Please log in to view this user's profile.</p> :
        (!requestedUser ? <p style={{ textAlign: "center" }}>This user doesn't exist.</p> : (
            <div className="profile">
                <section className="profilePosts">
                    <h2 className="profilePosts__heading">{requestedUser.username}'s Posts</h2>
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
                        <p className="profilePosts__noPostMessage"><b>{requestedUser.username}</b> doesn't have any posts!</p>
                    }

                    <SelectedPostDialog
                        close={() => setShowSelectedPost(false)}
                        post={selectedPost}
                        isOpen={showSelctedPost}
                        author={requestedUser}
                        loggedInUser={loggedInUser}
                    />
                </section >
            </div >
        )
        )
    )
}