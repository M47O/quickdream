import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PostForm from '../components/PostForm'
import PostDialog from '../components/PostDialog'
import PostCard from '../components/PostCard'
import './css/ProfilePage.css'

export default function ProfilePage({ user }) {
    const [showPreview, setShowPreview] = useState(false)
    const [post, setPost] = useState(null)
    const [myPosts, setMyPosts] = useState([])

    const handleCreatePost = (newPost) => {
        setPost(newPost)
        setShowPreview(true)
    }

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await fetch("http://localhost:4000/post/myPosts", { credentials: "include" });
                const myPostsData = await response.json();
                setMyPosts(myPostsData)
            } catch (err) {
                console.error(err);
            }
        }

        fetchPosts();
    }, []);

    console.log(myPosts)

    return (
        !user ? <p style={{ textAlign: "center" }}>Please log in to access your profile page.</p> : (
            <div className="profile">

                <PostDialog
                    isOpen={showPreview}
                    post={post}
                    close={() => {
                        setShowPreview(false)
                        setPost(null)
                    }}
                />

                <section className="profile__left">
                    <PostForm user={user} onCreatePost={handleCreatePost} />
                </section>
                <section className="profile__right">
                    <div className="myPosts">
                        {myPosts.map(post => (
                            <PostCard
                                key={post._id}
                                dateCreated={post.createdAt}
                                image={post.image}
                                title={post.title}
                                prompt={post.prompt}
                                likes={post.likes}
                            />
                        )
                        )}
                    </div>
                </section>
            </div>

        )
    )
}