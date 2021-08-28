import React, { useEffect } from 'react';

import './App.css';
import { Login } from './components/Auth/Login';
import { observer } from 'mobx-react-lite';
import { useRootStore } from './context/RootStateContext';
import ChatScreen from './components/Chat/ChatScreen';
import { configure } from 'mobx';
import { socketConnection } from './socket/socket.io';

configure({ enforceActions: "observed" })

const App: React.FC = () => {
  const { store }: any = useRootStore();

  useEffect(() => {
    socketConnection.on("connect", () => {
      console.log("Connection established between the user", socketConnection.id);
    });
  }, [])

  //set the user detail from the session storage when the page refresh
  useEffect(() => {
    const fetchCurrentUser = async () => {
      let currentUserData = await window.sessionStorage.getItem("currentUser");
      if (currentUserData) {
        currentUserData = JSON.parse(currentUserData);
        store.setCurrentUser(currentUserData);
      }
    }
    fetchCurrentUser();
  }, [store.currentUserDetail.isAuthenticated])

  return (
    <div className="App">
      {store.currentUserDetail && !store.currentUserDetail.isAuthenticated &&
        <Login addUsername={store.addUsername} addPassword={store.addPassword} login={store.login} />}
      {store.currentUserDetail && store.currentUserDetail.isAuthenticated &&
        <ChatScreen currentUserData={store.currentUserDetail} />
      }
    </div>
  )
}


export default observer(App);
