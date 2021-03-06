import React, {useContext, useRef, useEffect, useState} from 'react'
import { NavLink, Link, useHistory} from 'react-router-dom';
import {UserContext} from '../App'
import M from 'materialize-css'

const Navbar = () =>{

    const searchModal = useRef(null)
    const [search, setSearch] = useState("")
    const [userDetails, setUserDetails] = useState([])

    useEffect(()=>{
      M.Modal.init(searchModal.current)
    },[])

    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()
    const renderList =()=>{
        //here state is the user loggedin & having id , name, token
        if(state){
          return[
            <li key="1"><i data-target="modal1" className="material-icons modal-trigger" style={{color:"black"}}>search</i></li>,
            <li key="2"><NavLink to="/Profile">Profile</NavLink></li> ,
            <li key="3"><NavLink to="/CreatePost">Create Post</NavLink></li>,
            <li key="4"><NavLink to="/myfollowingposts">My Following Posts</NavLink></li>,
            <li key="5">
             <button  style={{marginRight:"10px"}} className="btn waves-effect waves-light red lighten-2" 
             onClick={()=>{localStorage.clear()
              dispatch({type:"CLEAR"})
              history.push('/Login')
              }}>
             Logout
             </button>
            </li>
          ]
   
    }else{
         return[
            <li key="6"><NavLink to="/SignUp">Sign Up</NavLink></li>,
            <li key="7"><NavLink to="/Login">Login</NavLink></li>
         ]
    }
}

const fetchUsers = (query)=>{
  setSearch(query)
  fetch('http://localhost:9090/search-users', {
    method:"post",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      query
    })
  }).then(res=>res.json())
  .then(results=>{
    setUserDetails(results.user)
  })
}

    return(
        <nav>
            <div className="nav-wrapper white">
                    <Link to={state?("/"):("/Login")} className="brand-logo left" style={{paddingLeft:"10px"}}>PlacesGogram</Link>
                    <ul id="nav-mobile" className="right">
                        {renderList()}
                       
                    </ul>
            </div>
            <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
                <div className="modal-content">
                <input type="text" placeholder="search users" value={search} onChange={(e)=>fetchUsers(e.target.value)} />
                <ul class="collection">
                  {
                    userDetails.map(item=>{
                      return <Link to={item._id !== state._id ? "/Profile/"+item._id:"/Profile"} onClick={()=>{
                        M.Modal.getInstance(searchModal.current).close()
                        setSearch('')
                      }}><li class="collection-item">{item.email}</li></Link> 
                    })
                  }
              
                </ul>
                </div>
                <div className="modal-footer">
                <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>Ok</button>
                </div>
            </div>
      </nav>
    )
}

export default Navbar;