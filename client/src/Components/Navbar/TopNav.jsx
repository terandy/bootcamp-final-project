import React from 'react';
import { useSelector } from 'react-redux';
import Logout from './../Home/Logout.jsx';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { SIDE_BAR_WIDTH, TOP_BAR_HEIGHT } from '../../data.js';

let Nav = styled.div`
box-sizing:border-box;
position:fixed;
display: ${props => (props.videoChat ? 'none' : 'block')};
top:0;
height: ${TOP_BAR_HEIGHT}px;
width: 100%;
border-bottom: solid 1px lightgrey;
padding: 0 ${SIDE_BAR_WIDTH}px;
z-index: 1000;
background-color: white;
div{
  width:100%;
  height:100%;
  display: ${props => (props.videoChat ? 'none' : 'flex')};
  color: rgb(0, 56, 70);
  
  justify-content: space-between;
  align-items: center;
  &>div{width:max-content;}
  a{margin-left:2em;}}
  }
}
`;
let Navbar = () => {
  let loggedIn = useSelector(state => state.login);
  let videoChat = useSelector(state => state.videoChat);
  let fname = useSelector(state => state.userInfo.fname);
  if (loggedIn) {
    return (
      <Nav videoChat={videoChat}>
        <div>
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
        <div>
          <div>Welcome</div>
          <div>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </Nav>
    );
  }
};
export default Navbar;
