import React from 'react';
import { formatDistance } from 'date-fns';

type MessageComponentProps = {
    currentLoggedUser: any,
    data: any,
}

export const MessageComponent: React.FC<MessageComponentProps> = ({ currentLoggedUser, data }) => {
    return (
        <li className={currentLoggedUser.id === data.userId ? 'current_user_chat' : 'other_user_chat'} >
            <div className="data_message_panel">
                    <span className="data_username">{data.user.username}:</span> 
                    <span className="data_message">{data.message}</span>
                    <span className="data_time">{formatDistance(new Date(), new Date(data.createdAt), { includeSeconds: true })}</span>
            </div>
        </li>
    )
}