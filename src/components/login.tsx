import "../styles/login.css"
import React, { useState } from 'react';

//TODO : connect with backend and backend should return a token
interface Credentials {
    username: string;
    password: string;
}

interface LoginProps {
    setToken: React.Dispatch<React.SetStateAction<string>>;
}




export default function Login(props: LoginProps) {
    const [username, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {
          const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
          });
          
          const data = await response.json();
          
          if (response.ok) {
            props.setToken(data.user.username);
          } else {
            alert(data.message);
          }
        } catch (error) {
          console.error('Login error:', error);
          alert('登錄失敗，請稍後再試');
        }
    };

    return (
        <>
            <img className="image-container" src="./images/shop_img.jpg"></img>
            <form className="login-box" onSubmit={handleSubmit}>
                <div className="login-header">
                    <header>Login</header>
                </div>
                <div className="input-box">
                    <input type="text" className="input-field" placeholder="Email / Username" autoComplete="on" required onChange={e => setUserName(e.target.value)} />
                </div>
                <div className="input-box">
                    <input type="password" className="input-field" placeholder="Password" autoComplete="off" required onChange={e => setPassword(e.target.value)} />
                </div>
                
                <div className="input-submit">
                    <button type="submit" className="submit-btn" id="submit">
                        <label htmlFor="submit">Sign In</label>
                    </button>
                </div>
                <div className="sign-up-label">
                    <label htmlFor="sign-up">Don't have an account? <a href="/signup">Sign Up</a></label>
                </div>
            </form>
        </>
    );
}
