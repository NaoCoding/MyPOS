import "../styles/login.css"
import React, { useState } from 'react';

//TODO : connect with backend and backend should return a token
interface Credentials {
    username: string;
    telphone: string;
    email: string;
    password: string;
}

interface LoginProps {
    setToken: React.Dispatch<React.SetStateAction<string>>;
}


export default function Login() {
    const [username, setUserName] = useState<string>('');
    const [telphone, setTelphone] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        //ToDo : fetch backend api and get token
    }

    return (
        <>
            <img className="image-container" src="./images/shop_img.jpg"></img>
            <form className="login-box" onSubmit={handleSubmit}>
                <div className="login-header">
                    <header>Sign Up</header>
                </div>
                <div className="input-box">
                    <input type="text" className="input-field" placeholder="Username" autoComplete="off" required onChange={e => setUserName(e.target.value)} />
                </div>
                <div className="input-box">
                    <input type="text" className="input-field" placeholder="Email" autoComplete="on" required onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="input-box">
                    <input type="text" className="input-field" placeholder="Telphone" autoComplete="off" required onChange={e => setTelphone(e.target.value)} />
                </div>
                <div className="input-box">
                    <input type="password" className="input-field" placeholder="Password" autoComplete="off" required onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="input-box">
                    <input type="password" className="input-field" placeholder="Confirm Password" autoComplete="off" required onChange={e => setConfirmPassword(e.target.value)} />
                </div>
                
                <div className="input-submit">
                    <button type="submit" className="submit-btn" id="submit">
                        <label htmlFor="submit">Sign Up</label>
                    </button>
                </div>
                <div className="sign-up-label">
                    <label htmlFor="sign-up">Already Have an account? <a href="/login">Login</a></label>
                </div>
            </form>
        </>
    );
}
