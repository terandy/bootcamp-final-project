import React from 'react';
import { useSelector } from 'react-redux';
import Logout from './../Home/Logout.jsx';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

let Nav = styled.div`
  grid-area: nav;
  display: flex;
  background-color: lightblue;
`;
let Navbar = props => {
  let loggedIn = useSelector(state => state.login);
  let fname = useSelector(state => state.userInfo.fname);
  if (loggedIn) {
    return (
      <Nav>
        <div>Hi {fname}!</div>
        <Logout />
      </Nav>
    );
  } else {
    return (
      <Nav>
        <div>Welcome</div>
        <Link to="/login">Login</Link>
      </Nav>
    );
  }
};
export default Navbar;
