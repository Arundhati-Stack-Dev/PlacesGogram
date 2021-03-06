import React, { useState, useContext } from 'react';
import M from 'materialize-css'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'


const Login = () => {

  const{state, dispatch} = useContext(UserContext)
    
  const history= useHistory();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] =useState("");

   const PostData = ()=>{

     if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
       M.toast({html: "invalid email", classes:"#c62828 red darken-3"})
       return
     }

     fetch("http://localhost:9090/signin",{
       method:"post",
       headers:{
         "Content-Type":"application/json"
       },
       body:JSON.stringify({
         
         password,
         email

       })
     }).then(res=>res.json())
     .then(data=>{
       console.log(data)
       if(data.error){
         M.toast({html: data.error, classes:"#c62828 red darken-3"})
          
       }
       else{
         localStorage.setItem("jwt", data.token )
         localStorage.setItem("user", JSON.stringify(data.user) )
         dispatch({type:"USER",payload:data.user})
         M.toast({html:"SignedIn success", classes:"#2e7d32 green darken-3"})
         history.push('/')
       }
     }).catch(err=>{
       console.log(err)
     })
     
   }
   
 
    return(
        <div className="cards-Signup">
        <div className="cards-auth-card">
           <h2>PlaceGogram</h2>
           
           <input type="text" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
           <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
           
            <button style={{marginTop:"10px"}} className="btn waves-effect waves-light red lighten-2" onClick={()=>PostData()}>
             
              Login
            </button>
            <div style={{paddingTop:"10px"}}>
                <Link to ="/SignUp">Don't have an account?</Link>
            </div>
           
       
      </div>
    </div>
    )
}

export default Login;