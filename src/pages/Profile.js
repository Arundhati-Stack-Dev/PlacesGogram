import React, {useEffect, useState, useContext} from 'react';
import {UserContext} from '../App'

const Profile = () =>{
    const [mypics, setPics] = useState([])
    const [flag, setFlag] = useState(false);
    const [pvt, setPvt] = useState("off");
    const [image, setImage] = useState("");

    
    const {state, dispatch} = useContext(UserContext)

    useEffect(()=>{
        fetch('http://localhost:9090/mypost',{
          headers:{
              "Authorization":"Bearer "+localStorage.getItem("jwt")
          }
        }).then(res=>res.json())
        .then(result=>{
           setPics(result.mypost)
        })
    },[])

    useEffect(()=>{
      if(image){
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
        //    setUrl(data.url)
        //    console.log(data)
        //    localStorage.setItem("user", JSON.stringify({...state, pic:data.url}))
        //    dispatch({type:"UPDATEPIC", payload:data.url})
           fetch('http://localhost:9090/updatepic',{
               method:"put",
               headers:{
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+localStorage.getItem("jwt")
               },
               body:JSON.stringify({
                   pic:data.url
               })
           }).then(res=>res.json())
           .then(result=>{
               console.log(result)
               localStorage.setItem("user", JSON.stringify({...state, pic:result.pic}))
               dispatch({type:"UPDATEPIC", payload:result.pic})
           })
        })
        .catch(err=>{console.log(err)})
      }
    },[image])

    const updatePhoto = (file) =>{
        setImage(file)
       
    }

    const handleToggle=(input)=>{
        if(input === "off"){
            setFlag(true)
            setPvt("on")

        }else{
            setFlag(false)
            setPvt("off")
        }
    }

    return(
        <div style={{maxWidth:"550px", margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px"
            }}>
                <div>
                    <img style ={{width:"160px", borderRadius:"50%", height:"160px"}}
                    src={state?state.pic:"loading"}/>
                   
                    <div className="file-field input-field">
                        <div className="btn">
                            <span>Update Profile pic</span>
                            <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])}/>
                        </div>
                        {/* <div className="file-path-wrapper">
                            <input className="file-path validate" type="text"/>
                        </div> */}
                    </div>
                </div>
                <div>
                    <h4>{state?state.name:"loading"}</h4>
                    <h5>{state?state.email:"loading"}</h5>
                    <div style={{display:"flex", justifyContent:"space-between", width:"108%" }}>
                        <h5>{mypics.length} posts</h5>
                        <h5>{state?state.followers.length:"0"} followers</h5>
                        <h5>{state?state.following.length:"0"} following</h5>
                    </div>
                        <div className="switch" style={{padding:"10px 20px"}}>
                            <label>
                            public
                            <input type="checkbox"/>
                            <span onClick={()=>handleToggle(pvt)} className="lever"></span>
                            private
                            </label>
                        </div>
                </div>

              
            </div>
           
            
            <br/>
            <div>
            {flag === false ? 
            (<div className="gallery" style={{borderTop:"1px solid grey", paddingTop:"10px"}}>
                {
                    mypics.map(item=>{
                        return(
                        <img className="item" key={item._id} src={item.photo} alt={item.title}/>
                        )
                    }) 
                }
        
            </div>)
            :
            null
            }
        
            </div>
        </div>
    )
}

export default Profile;