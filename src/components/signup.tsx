import "../styles/login.css"
import React, { useState } from 'react';

export default function SignUp() {
    const [username, setUserName] = useState<string>('');
    const [telephone, setTelephone] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
          alert('密碼和確認密碼不符！');
          return;
        }
        
        try {
          const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              username, 
              email, 
              telephone, 
              password 
            }),
            credentials: 'include'
          });
          
          const data = await response.json();
          console.log(data, response);
          
          if (response.ok) {
            //props.setToken(data.user.username);
            alert('註冊成功！');
            window.location.href = '/login';
          } else {
            alert(data.message);
          }
        } catch (error) {
          console.error('Registration error:', error);
          alert('註冊失敗，請稍後再試');
        }
    };

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
                    <input type="email" className="input-field" placeholder="Email" autoComplete="on" required onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="input-box">
                    <input type="tel" className="input-field" placeholder="Telphone" autoComplete="off" required onChange={e => setTelephone(e.target.value)} />
                </div>
                <div className="input-box">
                    <input type="password" className="input-field" placeholder="Password" autoComplete="off" required onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="input-box">
                    <input type="password" className="input-field" placeholder="Confirm Password" autoComplete="off" required onChange={e => setConfirmPassword(e.target.value)} />
                </div>
                
                <div className="input-submit">
                    <button type="submit" className="submit-btn" id="submit-signup">
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
