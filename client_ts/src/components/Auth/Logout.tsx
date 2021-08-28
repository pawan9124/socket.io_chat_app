import React from 'react';
import { Store } from '../../store';
import { socketConnection } from '../../socket/socket.io';

type LogoutProps = {
    logoutUser: Store["logoutUser"]
}

export const Logout: React.FC<LogoutProps> = ({ logoutUser }) => {
    const handleLogout = async () => {
        await window.sessionStorage.setItem("currentUser", "");
        socketConnection.emit('logout');
        logoutUser();
    }
    return (
        <div className="logout">
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}