import "../styles/login.css"
import React, { useState } from 'react';

//TODO : connect with backend and backend should return a token
interface Credentials {
    school_id: string;
    password: string;
}

interface LoginProps {
    setToken: React.Dispatch<React.SetStateAction<string>>;
}


export default function Login() {
    const [username, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        //ToDo : fetch backend api and get token
    }

    return (
        <>
            <img className="image-container" src="./images/shop_img.jpg"></img>
            <form className="login-box" onSubmit={handleSubmit}>
                <div className="login-header">
                    <header>Login</header>
                </div>
                <div className="input-box">
                    <input type="text" className="input-field" placeholder="StudentID" autoComplete="on" required onChange={e => setUserName(e.target.value)} />
                </div>
                <div className="input-box">
                    <input type="password" className="input-field" placeholder="Password" autoComplete="off" required onChange={e => setPassword(e.target.value)} />
                </div>
                
                <div className="input-submit">
                    <button type="submit" className="submit-btn" id="submit">
                        <label htmlFor="submit">Sign In</label>
                    </button>
                </div>
            </form>
        </>
    );
}
