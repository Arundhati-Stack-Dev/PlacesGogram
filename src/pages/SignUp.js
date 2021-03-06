import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';


const SignUp = () => {

  
    
   const history= useHistory();
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] =useState("");
   const [image, setImage] = useState("");
   const[url, setUrl] = useState(undefined);

   useEffect(()=>{
     if(url){
       uploadFields()
     }
   }, [url])

   const uploadProfilepic =()=>{
    const data = new FormData()
    data.append("file", image)
    data.append("upload_preset","PlacesGogram")
    data.append("cloud_name", "arundhati")
    fetch("https://api.cloudinary.com/v1_1/arundhati/image/upload",{
        method:"post",
        body:data
    })
    .then(res=>res.json())
    .then(data=>{
       setUrl(data.url)
    })
    .catch(err=>{console.log(err)})
   }

   const uploadFields =()=>{

    if( !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      M.toast({html: "invalid email", classes:"#c62828 red darken-3"})
      return
    }

    fetch("http://localhost:9090/signup",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        name,
        password,
        email,
        pic:url

      })
    }).then(res=>res.json())
    .then(data=>{
      if(data.error){
        M.toast({html: data.error, classes:"#c62828 red darken-3"})
         
      }
      else{
        M.toast({html:data.message, classes:"#2e7d32 green darken-3"})
        history.push('/Login')
      }
    }).catch(err=>{
      console.log(err)
    })
    
   }
 
    const PostData = ()=>{

      if(image){
        uploadProfilepic()
      }else{
         uploadFields()
      }

     
    }

    return(
      <div className="cards-Signup">
          <div className="cards-auth-card">
             <h2>PlacesGogram</h2>
             <input type="text" placeholder="name" className="input-field" value={name} onChange ={(e) =>setName(e.target.value)}/>
             <input type="text" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
             <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
             <div className="file-field input-field">
                <div className="btn">
                    <span>Upload Profile pic</span>
                    <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
              </div>
              
              <button style={{marginTop:"10px"}} className="btn waves-effect waves-light red lighten-2" onClick={()=>PostData()}>
                Sign Up
              </button>
              <div style={{paddingTop:"10px"}}>
                 <Link to="/Login">Already have an account?</Link>
              </div>
             
         
        </div>
      </div>
    )
}

export default SignUp;