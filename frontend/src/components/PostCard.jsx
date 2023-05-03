
import './css/PostCard.css'

export default function PostCard({ dateCreated, image, title, likes, prompt }) {
    return (
        <div className="postCard">
            <p className="postCard__title">{title}</p>
            <img className="postCard__image" src={image} alt={prompt}></img>
            <div className="postCard__stats">
                <p className="postCard__author"></p>
                <div className="postCard__likesArea">
                    <i className="postCard__likesHeart"></i>
                    <p className="postCard__likesNumber"></p>
                </div>
                <p className="postCard__prompt">{prompt}</p>
                <div className="postCard__comments">

                </div>
            </div>
        </div>
    )
}
