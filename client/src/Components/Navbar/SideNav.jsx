import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { SIDE_BAR_WIDTH } from '../../data.js';

let SideNavStyle = styled.div`
  display: grid;
  grid-area: sideNav;
  z-index: 100;
  background-color: rgb(100, 100, 100);
  & > div {
    position: fixed;
    width: ${SIDE_BAR_WIDTH}px;
    text-align: center;
    a {
      font-size: 0.7em;
      text-decoration: none;
      color: white;
      height: min-content;
    }

    div {
      box-sizing: border-box;
      padding: 1em;
      margin-bottom: 2em;
      &:hover {
        padding: 0.5em;
      }
      img {
        width: 70%;
      }
    }
  }
`;

let SideNav = () => {
  let me = useSelector(state => state.userInfo['_id']);
  let loggedIn = useSelector(state => state.login);
  return (
    <SideNavStyle props={loggedIn}>
      <div>
        <Link to="/active-users">
          <div>
            <img alt="" src={'/find-users.png'} style={{ width: '100%' }} />
            Discover
          </div>
        </Link>
        <Link to={'/profile/' + me}>
          <div>
            <img alt="" src={'/edit-profile.png'} />
            Profile
          </div>
        </Link>
        <Link to={'/messenger'}>
          <div>
            <img alt="" src={'/messages.png'} />
            Chat
          </div>
        </Link>
      </div>
    </SideNavStyle>
  );
};

export default SideNav;
