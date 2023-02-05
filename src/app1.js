import React, { useState,useEffect } from "react";
import { connect } from "react-redux";
import { Router, Switch, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardModerator from "./components/board-moderator.component";
import BoardAdmin from "./components/board-admin.component";

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";

import { history } from './helpers/history';

// import AuthVerify from "./common/auth-verify";
import EventBus from "./common/EventBus";


const App = (props) => {
  const [showModeratorBoard, setshowModeratorBoard] = useState(false);
  const [showAdminBoard, setshowAdminBoard] = useState(false);
  const [currentUser, setcurrentUser] = useState(undefined);
 
  history.listen((location) => {
      props.dispatch(clearMessage()); // clear message when changing location
    });
  
    useEffect(() => {
      const user = props.user;
      if (user) {
        setcurrentUser(user)
        setshowModeratorBoard(user.roles.includes("ROLE_MODERATOR"))
        setshowAdminBoard(user.roles.includes("ROLE_ADMIN"))

      }

      EventBus.on("logout", () => {
        logOut();
      });

      return () => {
        EventBus.remove("logout");
       } 
      
      }, []);
      



  const logOut = () => {
    props.dispatch(logout());
    setshowModeratorBoard(false);
    setshowAdminBoard(false);
    setcurrentUser(undefined);
   
  }


    
    return (
      <Router history={history}>
        <div>
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <Link to={"/"} className="navbar-brand">
              bezKoder
            </Link>
            <div className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={"/home"} className="nav-link">
                  Home
                </Link>
              </li>

              {showModeratorBoard && (
                <li className="nav-item">
                  <Link to={"/mod"} className="nav-link">
                    Moderator Board
                  </Link>
                </li>
              )}

              {showAdminBoard && (
                <li className="nav-item">
                  <Link to={"/admin"} className="nav-link">
                    Admin Board
                  </Link>
                </li>
              )}

              {currentUser && (
                <li className="nav-item">
                  <Link to={"/user"} className="nav-link">
                    User
                  </Link>
                </li>
              )}
            </div>

            {currentUser ? (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/profile"} className="nav-link">
                    {currentUser.username}
                  </Link>
                </li>
                <li className="nav-item">
                  <a href="/login" className="nav-link" onClick={logOut}>
                    LogOut
                  </a>
                </li>
              </div>
            ) : (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/login"} className="nav-link">
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to={"/register"} className="nav-link">
                    Sign Up
                  </Link>
                </li>
              </div>
            )}
          </nav>
          

          <div className="container mt-3">
            <Switch>
              <Route exact path={["/", "/home"]} component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/profile" component={Profile} />
              <Route path="/user" component={BoardUser} />
              <Route path="/mod" component={BoardModerator} />
              <Route path="/admin" component={BoardAdmin} />
            </Switch>
          </div>

         
        </div>
      </Router>
    );
  };

  //const { currentUser, showModeratorBoard, showAdminBoard } = state;
  function mapStateToProps(state) {
    const { user } = state.auth;
    return {
      user,
    };
  }


export default connect(mapStateToProps)(App);
