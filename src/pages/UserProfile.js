import React, {useEffect, useState, useContext} from 'react';
import {UserContext} from '../App'
import {useParams} from 'react-router-dom'

const Profile = () =>{
    const [userProfile, setProfile] = useState(null)
    const [flag, setFlag] = useState(false);
    const [pvt, setPvt] = useState("off");
    
    const {state, dispatch} = useContext(UserContext)
    const {userid} = useParams()
    // console.log(userid);
    const[showfollow, setShowFollow] = useState(state?!state.following.includes(userid):true)

    useEffect(()=>{
        fetch(`http://localhost:9090/user/${userid}`,{
          headers:{
              "Authorization":"Bearer "+localStorage.getItem("jwt")
          }
        }).then(res=>res.json())
        .then(result=>{
        //   console.log(result)
          
           setProfile(result)
        })
    },[])

    const followUser =()=>{
        fetch('http://localhost:9090/follow', {
            method:"put",
            headers:{
               "Content-Type":"application/json",
               "Authorization":"Bearer "+localStorage.getItem('jwt') 
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            // console.log(data)
            dispatch({
                type:"UPDATE", payload:{following:data.following, followers:data.followers}
            })
            localStorage.setItem("user", JSON.stringify(data))
             setProfile((prevState)=>{
                 return{
                     ...prevState,
                     user:{
                         ...prevState.user,
                        followers:[...prevState.user.followers, data._id]
                    }
                 }
             })
             setShowFollow(false)
        })
    }


    const unFollowUser =()=>{
        fetch('http://localhost:9090/unfollow', {
            method:"put",
            headers:{
               "Content-Type":"application/json",
               "Authorization":"Bearer "+localStorage.getItem('jwt') 
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            // console.log(data)
            dispatch({
                type:"UPDATE", payload:{following:data.following, followers:data.followers}
            })
            localStorage.setItem("user", JSON.stringify(data))
            
             setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item =>item!== data._id)
                 return{
                     ...prevState,
                     user:{
                         ...prevState.user,
                        followers:newFollower
                    }
                 }
             })
             setShowFollow(true)
            
        })
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
        <>
        {userProfile ?
         
         <div style={{maxWidth:"550px", margin:"0px auto"}}>
         <div style={{
             display:"flex",
             justifyContent:"space-around",
             margin:"18px 0px"
         }}>
             <div>
                 <img style ={{width:"160px", borderRadius:"50%", height:"160px"}}
                 src={userProfile.user.pic}/>
             </div>
             <div>
                 <h4>{userProfile.user.name}</h4>
                 {/* <h5>{userProfile.user.email}</h5> */}
                 <div style={{display:"flex", justifyContent:"space-between", width:"108%" }}>
                     <h5>{userProfile.posts.length} posts</h5>
                     <h5>{userProfile.user.followers.length} followers</h5>
                     <h5>{userProfile.user.following.length} following</h5>
             </div>
                 <div style={{display:"flex"}}>
                 <div>
                 {showfollow?
                 <button style={{marginTop:"10px"}} className="btn waves-effect waves-light red lighten-2" onClick={()=>followUser()}>
             
                 Follow
                 </button>
                 :
                 <button style={{marginTop:"10px"}} className="btn waves-effect waves-light red lighten-2" onClick={()=>unFollowUser()}>
             
                 Unfollow
                 </button>
                }
                </div>
                
                {/* <div className="switch" style={{padding:"10px 20px"}}>
                    <label>
                    public
                    <input type="checkbox"/>
                    <span onClick={()=>handleToggle(pvt)} className="lever"></span>
                    private
                    </label>
              </div> */}
              </div>
                 
                  
             </div>
             
         </div>

         <br/>
         {flag === false ? 
         (<div className="gallery" style={{borderTop:"1px solid grey", paddingTop:"10px"}}>
             {
                userProfile.posts.map(item=>{
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
        
        
        
        : <div style={{marginTop:"50px", marginLeft:"50px"}} class="preloader-wrapper big active">
            <div class="spinner-layer spinner-red-only">
            <div class="circle-clipper left">
            <div class="circle"></div>
            </div><div class="gap-patch">
            <div class="circle"></div>
            </div><div class="circle-clipper right">
            <div class="circle"></div>
            </div>
            </div>
           </div>}
      
       </> 
    )
}

export default Profile;