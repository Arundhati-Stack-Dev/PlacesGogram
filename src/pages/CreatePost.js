import React, {useState, useEffect} from 'react'
import M from 'materialize-css'
import {useHistory} from 'react-router-dom'

const CreatePost = () => {
  const history = useHistory()
  // const[title, setTitle] = useState("")
  const[place, setPlace] = useState("")
  const[body, setBody] = useState("")
  const[image, setImage] = useState("")
  const[url, setUrl] = useState("")

   //the useeffect will kickin when url changes
   useEffect(()=>{
    //use effect will also kickin when components mounts, to prevent condition will be -
    //if url exists then only if will call this
    if(url){
        fetch("http://localhost:9090/createpost",{
            method:"post",
            headers:{
              "Content-Type":"application/json",
              "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
              // title,
              place,
              body,
              pic:url
     
            })
          }).then(res=>res.json())
          .then(data=>{
           console.log(data)
            if(data.error){
              M.toast({html: data.error, classes:"#c62828 red darken-3"})
               
            }
            else{
              M.toast({html:"Created Post Successfully!", classes:"#2e7d32 green darken-3"})
              history.push('/')
            }
          }).catch(err=>{
            console.log(err)
          })
          
        }
        

}, [url])

const postDetails =()=>{
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
  
  return(
    <>
      <div className="card input-filed"
        style={{
            margin:"30px auto",
            maxWidth:"500px",
            padding:"20px",
            textAlign:"center"
        }} 
         >
          {/* <input  type="text" placeholder="title" value={title} onChange={(e)=>setTitle(e.target.value)}/> */}
          <input  type="text" placeholder="place" value={place} onChange={(e)=>setPlace(e.target.value)}/>
          
          <input  type="text" placeholder="body" value={body} onChange={(e)=>setBody(e.target.value)}/>
          <div className="file-field input-field">
              <div className="btn">
                  <span>Upload Image</span>
                  <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
              </div>
              <div className="file-path-wrapper">
                  <input className="file-path validate" type="text"/>
              </div>
          </div>
           <button className="btn waves-effect waves-light  red lighten-2" onClick={()=>postDetails()}>
            Submit Post
          </button> 
      </div>
      </>
  );
}

export default CreatePost
