import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Logout from './../Home/Logout.jsx';
import Login from '../Home/Login.jsx';
import Register from '../Home/Register.jsx';
import styled from 'styled-components';
import { SIDE_BAR_WIDTH, TOP_BAR_HEIGHT } from '../../data.js';
let SidePop = styled.div`
  transition: ease-in-out 0.5s;
  position: absolute;
  top: ${TOP_BAR_HEIGHT}px;
  height: 100vh;
  box-sizing: border-box;
  @media screen and (min-width: 500px) {
    width: 400px;
    right: ${props => (props.propsDisplay === 'flex' ? '0' : '-400px')};
  }
  @media screen and (max-width: 500px) {
    width: 100vw;
    right: ${props => (props.propsDisplay === 'flex' ? '0' : '-100vw')};
  }
  background-color: white;
`;
let Nav = styled.div`
  box-sizing: border-box;
  position: fixed;
  display: ${props => (!props.videoChatMode ? 'block' : 'none')};
  top: 0;
  left: 0;
  height: ${TOP_BAR_HEIGHT}px;
  width: 100%;
  border-bottom: solid 1px lightgrey;
  @media screen and (max-width: 500px) {
    padding: 0 ${SIDE_BAR_WIDTH / 2}px;
  }
  @media screen and (min-width: 500px) {
    padding: 0 ${SIDE_BAR_WIDTH}px;
  }
  z-index: 1000;
  background-color: white;
  .divContainer {
    width: 100%;
    height: 100%;
    display: ${props => (!props.videoChatMode ? 'flex' : 'none')};
    color: rgb(0, 56, 70);
    justify-content: space-between;
    align-items: center;
    .rightLinks {
      display: flex;
    }
  }
`;
let Click = styled.div`
  margin-left: 1em;
  &:hover {
    cursor: pointer;
    color: purple;
    text-decoration: underline;
  }
`;
let Exit = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 30px;
  width: 30px;
  font-size: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;
let Outer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;
let Navbar = () => {
  let loggedIn = useSelector(state => state.login);
  let videoChatMode = useSelector(state => state.videoChatMode);
  let fname = useSelector(state => state.userInfo.fname);
  let [loginDisplay, setLoginDisplay] = useState('none');
  let [registerDisplay, setRegisterDisplay] = useState('none');
  useEffect(() => {
    if (loggedIn) {
      toggleBoth();
    }
  }, [loggedIn]);
  let toggleBoth = () => {
    setLoginDisplay('none');
    setRegisterDisplay('none');
  };
  let toggleLogin = () => {
    if (loginDisplay === 'flex') {
      setLoginDisplay('none');
    } else {
      setLoginDisplay('flex');
      setRegisterDisplay('none');
    }
  };
  let toggleRegister = () => {
    if (registerDisplay === 'flex') {
      setRegisterDisplay('none');
    } else {
      setRegisterDisplay('flex');
      setLoginDisplay('none');
    }
  };
  if (loggedIn) {
    return (
      <Nav videoChatMode={videoChatMode}>
        <div className="divContainer">
          <div>Hi {fname}</div>
          <div>
            <Logout />
          </div>
        </div>
      </Nav>
    );
  } else {
    return (
      <Nav>
        <div className="divContainer">
          <div>Welcome</div>
          <div className="rightLinks">
            <Click onClick={toggleLogin}>Login</Click>
            <SidePop propsDisplay={loginDisplay}>
              <Outer>
                <Exit onClick={toggleBoth}>x</Exit>
                <Login />
              </Outer>
            </SidePop>
            <Click onClick={toggleRegister}>Register</Click>
            <SidePop propsDisplay={registerDisplay}>
              <Outer>
                <Exit onClick={toggleBoth}>x</Exit>
                <Register />
              </Outer>
            </SidePop>
          </div>
        </div>
      </Nav>
    );
  }
};
export default Navbar;
