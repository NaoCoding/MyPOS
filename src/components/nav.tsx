import React from "react"
import {Link , useMatch , useResolvedPath} from "react-router-dom"
import "../styles/nav.css"

export default function Navbar(role_id: any) {
    
    //ToDo: I think we may need a parameter of Navbar for detecting the role
    //in order to display different navbar for different roles.
    role_id = role_id.role_id || 0; // Default to 0 if role_id is not provided 

    console.log("role_id:", role_id);
    

    if(role_id == 1){
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

    return null

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