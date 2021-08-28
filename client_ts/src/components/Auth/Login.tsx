import React, { useState } from 'react';
import { Store } from '../../store';
import { socketConnection } from '../../socket/socket.io';
import './style.css';

type LoginProps = {
    addUsername: Store['addUsername'],
    addPassword: Store['addPassword'],
    login: Store['login']
}

export const Login: React.FC<LoginProps> = ({ addUsername, addPassword, login }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const modifyUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        addUsername(e.target.value);
        setUsername(e.target.value);
    }
    const modifyPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        addPassword(e.target.value);
        setPassword(e.target.value);
    }
    const handleLogin = () => {

        if (username && password) {
            socketConnection.emit('login');
            login();
        } else {
            alert("Invalid Login!!")
        }
    }

    return (
        <div className="login_container">
            <h2>Welcome to the Flash Strange Chat portal!!!</h2>
            <div className="login_box">
                <img className="logo" src={require('../../assets/logo_chat.png').default} alt="logo_img" />
                <input type="text" className="login_input" placeholder="username" value={username}
                    onChange={(e) => modifyUsername(e)}
                />
                <input type="password" className="login_password" placeholder="password" value={password}
                    onChange={(e) => modifyPassword(e)} />
                <button className="login_button" onClick={() => handleLogin()}>Enter</button>
                <small className="spam_message">* Note: Spamming the chat would lead to disconnection of session.</small>
            </div>
        </div>
    )

}
