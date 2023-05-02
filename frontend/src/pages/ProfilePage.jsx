import { useState } from 'react'
import { Link } from 'react-router-dom'
import PostForm from '../components/PostForm'
import './css/ProfilePage.css'

export default function ProfilePage({ user }) {

    return (
        !user ? <p style={{ textAlign: "center" }}>Please log in to access your profile page.</p> : (
            <div className="profile">
                <section className="profile__left">
                    <PostForm user={user} />
                </section>
                <section className="profile__right">
                    <p>Right side</p>
                </section>
            </div>

        )
    )
}