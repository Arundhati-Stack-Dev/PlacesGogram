import React,{useEffect, createContext, useReducer, useContext} from 'react'
import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom'
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Profile from './pages/Profile'
import Home from './pages/Home'
import Createpost from './pages/CreatePost'
import {reducer, initialState} from './reducers/userReducer'
import UserProfile from'./pages/UserProfile'
import SubscribedUserPosts from './pages/SubscribedUserPosts'

export const UserContext = createContext()

const Routing =()=>{

  const history = useHistory()
  const {state,dispatch} = useContext(UserContext) //dispatch everything to central state
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    // console.log(typeof(user), user)
    if(user){
      dispatch({type:"USER",payload:user})
      // history.push('/') // while refreshing from profile page, no need to redirect to home screen
    }else{
      history.push('/Login')
    }
  },[])
  return(
    <Switch>
    <Route path="/" exact>
     <Home/>
    </Route>
    <Route path="/SignUp" exact>
      <SignUp/>
    </Route>
    <Route path="/Login" exact>
     <Login/>
    </Route>
    <Route path="/Profile" exact>
     <Profile/>
    </Route>
    <Route path="/Createpost" exact>
     <Createpost/>
    </Route>
    <Route path="/Profile/:userid" exact>
     <UserProfile/>
    </Route>
    <Route path="/myfollowingposts" exact>
     <SubscribedUserPosts/>
    </Route>
   
    </Switch>

  )
}

function App() {

  const [state, dispatch] = useReducer(reducer, initialState)
  return (

    <UserContext.Provider value={{state, dispatch}}>
    <BrowserRouter>
     <Navbar/>
     <Routing/>
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
