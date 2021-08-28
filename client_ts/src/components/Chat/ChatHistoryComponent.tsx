import React from 'react';
import { Store } from '../../store';
import { useRootStore } from '../../context/RootStateContext';
import { MessageComponent } from './MessageComponent';


type chatHistoryProps = {
    chatHistory: Store['chatHistory'],

}

export const ChatHistoryComponent: React.FC<chatHistoryProps> = ({ chatHistory }) => {
    const { store } = useRootStore();
    const currentLoggedUser: any = store.currentUserDetail;
    const chatList = chatHistory.map((data: any, index: number) => (
        <MessageComponent key={data.id + "" + index} currentLoggedUser={currentLoggedUser} data={data} />
    ))
    return (
        <div className="chat_history">
            <div className="chat_panel">
                <ul className="chat_list">
                    {chatList}
                </ul>
            </div>
        </div>
    )
}