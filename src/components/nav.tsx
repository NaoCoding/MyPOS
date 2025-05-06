import React from "react"
import {Link , useMatch , useResolvedPath} from "react-router-dom"
import "../styles/nav.css"

export default function Navbar() {
    
    //ToDo: I think we may need a parameter of Navbar for detecting the role
    //in order to display different navbar for different roles.

    return(
        <nav className="nav">
            <Link to="/" className="site-title">
                MyPos
            </Link>
            <ul>
                <CustomLink to="/">Home</CustomLink>
                <CustomLink to="/upload">Order History</CustomLink>
                <CustomLink to="/setting">Setting</CustomLink>
                <CustomLink to="/">Logout</CustomLink>
            </ul>
        </nav>
    )

}

function CustomLink({ to, children, onClick = () => { }, ...props }: { to: string, children: React.ReactNode, onClick?: () => void }) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })

    return (
        <li className={isActive ? "active" : ""} onClick={onClick}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    )
}