import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import apiUrl from '../api'
import SelectedPostDialog from '../components/SelectedPostDialog'
import Button from '@mui/material/Button'
import './css/ProfilePage.css'

export default function ProfileByIdPage({ loggedInUser, updateUser }) {
    const [requestedUser, setRequestedUser] = useState(null)
    const [showSelectedPost, setShowSelectedPost] = useState(false)
    const [displayedPosts, setDisplayedPosts] = useState([])
    const [selectedPost, setSelectedPost] = useState(null)
    const [isFollowed, setIsFollowed] = useState(false)
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

    const fetchPosts = async () => {
        try {
            if (requestedUser !== null) {
                const response = await fetch(`${apiUrl}/api/post/user/${requestedUser.id}`);
                const profilePostsData = await response.json();
                setDisplayedPosts(profilePostsData)
            }
        } catch (err) {
            console.error(err);
        }
    }

    const handleFollow = async () => {
        try {
            if (isFollowed) {
                //Unfollow
                const response = await fetch(`${apiUrl}/api/user/unfollow`, {
                    method: "PUT",
                    body: JSON.stringify({
                        id: loggedInUser.id,
                        userToUnfollow: requestedUser.id
                    }),
                    headers: {
                        "Content-type": "application/json",
                    },
                })
                const updatedUser = { ...loggedInUser, followedUsers: loggedInUser.followedUsers.filter(id => id !== requestedUser.id) }
                localStorage.setItem("user", JSON.stringify(updatedUser))
                updateUser(updatedUser)
            }

            if (!isFollowed) {
                //Follow
                const response = await fetch(`${apiUrl}/api/user/follow`, {
                    method: "PUT",
                    body: JSON.stringify({
                        id: loggedInUser.id,
                        userToFollow: requestedUser.id
                    }),
                    headers: {
                        "Content-type": "application/json",
                    },
                })
                const updatedUser = { ...loggedInUser, followedUsers: [...loggedInUser.followedUsers, requestedUser.id] }
                localStorage.setItem("user", JSON.stringify(updatedUser))
                updateUser(updatedUser)
            }
        } catch (err) {
            console.error(err)
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

    useEffect(() => {
        if (loggedInUser && requestedUser && loggedInUser.followedUsers.includes(requestedUser.id)) {
            setIsFollowed(true)
        } else {
            setIsFollowed(false)
        }
    }, [requestedUser, loggedInUser])

    return (!loggedInUser ? <p style={{ textAlign: "center" }}> Please log in to view this user's profile.</p> :
        (!requestedUser ? <p style={{ textAlign: "center" }}>This user doesn't exist.</p> : (
            <div className="profile">

                <section className="profilePosts">
                    <h2 className="profilePosts__heading">{requestedUser.username}'s Posts</h2>
                    <div className="profile__buttonContainer">
                        <Button
                            className="profile__followButton"
                            variant={isFollowed ? "outlined" : "contained"}
                            onClick={handleFollow}
                        >
                            {isFollowed ? "Unfollow user" : "Follow user"}
                        </Button>
                    </div>
                    {
                        displayedPosts.length > 0 ? (

                            <div className="postGrid">
                                {displayedPosts.map(post => (
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
                        isOpen={showSelectedPost}
                        author={requestedUser}
                        loggedInUser={loggedInUser}
                    />
                </section >
            </div >
        )
        )
    )
}