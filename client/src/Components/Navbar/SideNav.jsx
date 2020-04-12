import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { SIDE_BAR_WIDTH, TOP_BAR_HEIGHT } from '../../data.js';

let SideNavStyle = styled.div`
  display: ${props =>
    props.logggedIn && !props.videoChatMode ? 'block' : 'none'};
  z-index: 100;
  background-color: rgb(100, 100, 100);
  position: fixed;
  @media screen and (min-width: 500px) {
    left: 0;
    top: ${TOP_BAR_HEIGHT}px;
    height: 100%;
    & > div {
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
        position: relative;
        height: 70px;
        &:hover {
          padding: 0.5em;
        }
        img {
          width: 70%;
        }
      }
    }
  }
  @media screen and (max-width: 500px) {
    bottom: 0;
    width: 100%;
    height: ${SIDE_BAR_WIDTH}px;
    & > div {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      a {
        font-size: 0.7em;
        text-decoration: none;
        color: white;
        height: 100%;
        width: 30%;
      }

      div {
        box-sizing: border-box;
        padding: 1em;
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        &:hover {
          padding: 0.5em;
        }
        img {
          height: 70%;
          width: auto;
          margin-bottom: 0.5em;
        }
      }
    }
  }
  .notify {
    position: absolute;
    top: 10px;
    right: 1em;
    height: ${props => (props.notify ? '10px' : '0')};
    width: ${props => (props.notify ? '10px' : '0')};
    border-radius: 50%;
    background-color: ${props => (props.notify ? 'purple' : 'transparent')};
    margin: 0;
    padding: 0;
    transition: height ease-in-out 0.2s, width ease-in-out 0.2s;
  }
`;

let SideNav = () => {
  let location = useLocation();
  let loggedIn = useSelector(state => state.login);
  let videoChatMode = useSelector(state => state.videoChatMode);
  let notifications = useSelector(state => state.notifications);
  let [notify, setNotify] = useState(false);
  let scrollLeft = () => {
    window.scrollTo({ left: 0 });
  };
  useEffect(() => {
    if (
      Object.values(notifications).some(x => x === true) &&
      location.pathname.slice(0, 10) !== '/messenger'
    ) {
      setNotify(true);
    } else {
      setNotify(false);
    }
  }, [notifications, location.pathname]);
  return (
    <SideNavStyle
      logggedIn={loggedIn}
      videoChatMode={videoChatMode}
      notify={notify}
    >
      <div>
        <Link to="/active-users">
          <div>
            <img alt="" src={'/find-users.png'} />
            Discover
          </div>
        </Link>
        <Link to={'/profile'}>
          <div>
            <img alt="" src={'/edit-profile.png'} />
            Profile
          </div>
        </Link>
        <Link onClick={scrollLeft} to={'/messenger'}>
          <div>
            <img alt="" src={'/messages.png'} />
            Chat
            <div className="notify"></div>
          </div>
        </Link>
      </div>
    </SideNavStyle>
  );
};

export default SideNav;
