import { observable, action, makeAutoObservable, makeObservable, autorun } from "mobx";
import { loadHistoryChat, loginUser } from "./service/api";



export class Store {
    

   @observable isAuthenticated:boolean = false;
   @observable.ref currentUserDetail:object = {};
   @observable.ref chatHistory: object[] = [];
   @observable username:string = '';
   @observable password:string = '';
   @observable currentMessage:string = '';
   @observable userCount:number = 0;

    constructor() {
        makeObservable(this);
        autorun(()=>{
            console.log("RUN THE AUTo");
        })

    }
   
    @action
    login = async () => {
        const loginUserData = await loginUser(this.username, this.password);
        this.isAuthenticated = loginUserData.isAuthenticated;
        if(loginUserData){
            //set the userDetails in the session storage
            await window.sessionStorage.setItem("currentUser",JSON.stringify(loginUserData));
            const currentUserData = await window.sessionStorage.getItem("currentUser");
            if(currentUserData){
                this.currentUserDetail = JSON.parse(currentUserData);
            }  
        }
    }

    @action
    loadChats = async()=>{
        const historyChat = await loadHistoryChat();
            this.chatHistory = historyChat;
    }

    @action 
    addUsername = (username:string)=>{
        this.username = username;
    }

    @action
    addPassword = (password:string)=>{
        this.password = password;
    }

    @action 
    addCurrentMessage = (message:string)=>{
        this.currentMessage = message;
    }
    @action 
    addMessageToChat = (currentMessage:object)=>{
        this.chatHistory.push(currentMessage);
    }
    @action 
    logoutUser = ()=>{
        this.currentUserDetail = {};
        this.isAuthenticated = false;
    }
    @action
    setCurrentUser =(user:object)=>{
        this.currentUserDetail = user;
    }
    @action
    setUserCount = (count:number)=>{
        this.userCount = count;
    }

}
