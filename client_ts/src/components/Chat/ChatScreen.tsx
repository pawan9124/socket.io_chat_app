import React, { useEffect, useState } from 'react';
import { useRootStore } from '../../context/RootStateContext';
import { ChatHistoryComponent } from './ChatHistoryComponent';
import { socketConnection } from '../../socket/socket.io';
import { observer } from 'mobx-react-lite';
import { Logout } from '../Auth/Logout';
import './style.css';

type currentUserType = {
    currentUserData: {
        isAuthenticated: boolean,
        username: string,
        id: number,
        isNew: boolean
    }
}
type typingUser = {
    isTyping?: boolean,
    username?: string,
    id?: number

}

type spamWarning = {
    isWarn?: boolean,
    message?: string
}
type setBannedData = {
    message?: string,
    userId?: number,
    username?: string,
    isBanned?: boolean
}


const ChatScreen: React.FC<currentUserType> = ({ currentUserData }) => {
    const [message, setMessage] = useState<string>('');
    const { store } = useRootStore();
    let [chatHistoryData, setChatHistoryData] = useState(store.chatHistory);
    const [typingUser, setTypingUser] = useState<typingUser>({});
    const [spamWarning, setSpamWarning] = useState<spamWarning>({});
    const [bannedData, setBannedData] = useState<setBannedData>({});
    const [userCount, setUserCount] = useState<number>(0);



    useEffect(() => {
        store.loadChats();

        socketConnection.on('newMessage', (message: any) => {
            store.addMessageToChat(message);
            setChatHistoryData(message);
        });

        socketConnection.emit('get_num_user');

        //flooding user get disconnected
        socketConnection.on('banned', (message: any) => {
            setBannedData(message);
        })

        //listen to the typing event
        socketConnection.on('typing', (user: typingUser) => {
            setTypingUser(user)
        });

        //listen to the not typing event
        socketConnection.on('not_typing', (user: typingUser) => {
            setTypingUser(user);
        })

        //spam warning
        socketConnection.on('spam_warning', (warning: any) => {
            setSpamWarning(warning);
        });
        //fetch user count
        socketConnection.on('user_count', (count: number) => {
            setUserCount(count);
        });
        //remove connection when the component unmount
        return () => {
            socketConnection.removeAllListeners()
        }

    }, [])


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.value) {
            const currentUserDetail = currentUserData;
            socketConnection.emit('typing', { id: currentUserDetail.id, username: currentUserDetail.username })
            setMessage(e.target.value);
        } 
    }
    const handleSendMessage = () => {
        const currentUserDetail = currentUserData;
        if (message) {
            socketConnection.emit('newMessage', { message, id: currentUserDetail.id, username: currentUserDetail.username })
            setMessage('');
            let currentMsg = {
                createdAt: new Date().toISOString(),
                id: -1,
                message: message,
                user: {
                    id: currentUserDetail.id,
                    username: currentUserDetail.username
                },
                userId: currentUserDetail.id
            }
            const currentChat = store.chatHistory;
            currentChat.push(currentMsg)
            setChatHistoryData(currentChat);
        }
    }
    //handle when the focus is removed from input
    const handleOnBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const currentUserDetail = currentUserData;
        socketConnection.emit('not_typing', { message, id: currentUserDetail.id, username: currentUserDetail.username });

    }

    return (
        <div className="chat_screen">
            <div>
                <h3>Welcome to stranger chat,<span className="username"> {currentUserData.username}</span> </h3>
                <div> Total online users: {userCount}</div>
                <div style={{ marginTop: 10 }}><small className="warning_message">* Don't send continous message more than 10 in interval of 10 sec lead to disconnection.</small></div>
            </div>
            <div className="logout_button">
                <Logout logoutUser={store.logoutUser} />
            </div>
            <div className="chat_history_container">
                <ChatHistoryComponent chatHistory={store.chatHistory} />
                {typingUser.isTyping && <span className="typing_user">{typingUser.username} is typing....</span>}
                {spamWarning.isWarn && !bannedData.isBanned && <span className="spam_warning">{spamWarning.message}</span>}
                {bannedData.isBanned && <span className="banned_user">{bannedData.message}</span>}

            </div>
            <div className="chat_input" style={{ marginTop: typingUser.isTyping ? '-14px' : 0 }}>
                <input type="text" placeholder="Type message...." className="input_box" value={message} onChange={(e) => handleInputChange(e)} onBlur={(e) => handleOnBlur(e)}
                />
                <button onClick={() => handleSendMessage()}>Send</button>
            </div>
        </div>
    )
};

export default observer(ChatScreen);