import { Link } from 'react-router-dom'

export default function HomePage(){
    return(
        <>
        <Link to="auth">Login / Sign up</Link>
        <section>
            About
        </section>
        <section>
            Sample Images
        </section>
        </>
    )
}