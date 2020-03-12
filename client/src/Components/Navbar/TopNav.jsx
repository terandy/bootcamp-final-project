import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Logout from './../Home/Logout.jsx';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { SIDE_BAR_WIDTH } from '../../data.js';
import { useHistory } from 'react-router-dom';

let Nav = styled.div`
  display: grid;
  grid-area: topNav;
  z-index: 100;
  border-bottom: solid 1px lightgrey;
  color: rgb(0, 56, 70);
  background-color: white;
  position: sticky;
  top: 0;
  & > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 ${SIDE_BAR_WIDTH}px;
    a {
      margin-left: 1em;
    }
  }
`;
let Navbar = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  let displayDialog = useSelector(state => state.displayDialog);
  if (displayDialog.set) {
    history.push('/video-chat/' + displayDialog.convoID);
    dispatch({
      type: 'set-display-dialog',
      content: { set: false, convoID: '' }
    });
  }
  let loggedIn = useSelector(state => state.login);
  if (loggedIn) {
    return (
      <Nav>
        <div>
          <div>Logo</div>
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
