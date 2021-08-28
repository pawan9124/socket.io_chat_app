
export const loginUser  = async (username:string, password:string)=>{
   return fetch('http://localhost:4000/api/login',{
        method:"POST",
        headers:{
            Accept:"appliation/json",
            "Content-type":"application/json",
        },
        body: JSON.stringify({username,password})
    }).then((res)=>res.json());
}

export const loadHistoryChat = ():Promise<object[]>=>{
    return fetch('http://localhost:4000/api/history').then(res=>res.json());
}