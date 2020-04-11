import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import styled from 'styled-components';
import Form from './SearchBarStyle.jsx';
let MyInfo = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0.5em;
  color: black;
  img {
    height: 4em;
    width: 4em;
    border-radius: 50%;
    margin-right: 0.5em;
    object-fit: cover;
  }
`;
let Container = styled.div`
  box-sizing: border-box;
  padding: 0.5em;
  @media screen and (max-width: 500px) {
    width: 50%;
  }
  @media screen and (min-width: 500px) {
    width: 300px;
  }
  height: 100%;
  .box {
    box-sizing: border-box;
    background-color: white;
    height: 100%;
    border-radius: 0.5em;
    padding: 0.5em;
    display: flex;
    flex-direction: column;
    h2 {
      font-size: 1em;
    }
    a {
      width: 100%;
      display: block;
    }
    .list-convos {
      overflow: scroll;
    }
  }
  .search {
    padding: 0;
    padding-bottom: 1em;
  }
`;
//SearchBar is a functional component that takes as props a function.
//This function is called on submission of the form.
let ListStyle = styled.div`
  div {
    border-radius: 1em;
    background-color: ${props =>
      props.current ? 'rgb(240, 240, 240)' : 'transparent'};
    color: ${props => (props.current ? 'rgb(120, 120, 120)' : 'black')};
    display: flex;
    align-items: center;
    padding: 0 1em;
    position: relative;
    p {
      background-color: transparent;
    }
    &:hover {
      cursor: pointer;
      background-color: rgb(250, 250, 250);
    }
    img {
      border: 2px solid;
      border-color: ${props => (props.active ? 'lightgreen' : 'lightgrey')};
      height: 2em;
      width: 2em;
      border-radius: 50%;
      margin-right: 1em;
      object-fit: cover;
    }
    .notification {
      position: absolute;
      top: 10px;
      right: 0px;
      height: ${props => (props.notify ? '10px' : '0')};
      width: ${props => (props.notify ? '10px' : '0')};
      border-radius: 50%;
      background-color: ${props => (props.notify ? 'purple' : 'transparent')};
      margin: 0;
      padding: 0;
      transition: height ease-in-out 0.2s, width ease-in-out 0.2s;
    }
  }
`;

let ConvoList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  let convoList = useSelector(state => state.convoList);
  let loggedIn = useSelector(state => state.login);
  let convoUsers = useSelector(state => state.convoUsers);
  let currentConvo = useSelector(state => state.currentConvo);
  let imgSrc = useSelector(state => state.userInfo.imgSrc);
  let fname = useSelector(state => state.userInfo.fname);
  let lname = useSelector(state => state.userInfo.lname);
  let activeMembers = useSelector(state => state.activeUsers);
  let notifications = useSelector(state => state.notifications);
  let [filter, setFilter] = useState('');
  let onSubmit = evt => {
    evt.preventDefault();
    setFilter('');
  };
  let onChange = evt => {
    setFilter(evt.target.value);
  };
  let getConvo = (convoID, userID) => {
    window.scrollTo({ left: window.innerWidth, behavior: 'smooth' });
    dispatch({ type: 'set-current-convo', content: convoID });
    dispatch({ type: 'remove-notification', content: userID });
    history.push('/messenger/' + convoID);
  };
  if (!convoList) {
    return <div></div>;
  }
  return (
    <Container loggedIn={loggedIn}>
      <div className="box">
        <Link to={'/profile'} style={{ textDecoration: 'none' }}>
          <MyInfo>
            <img alt="" src={imgSrc ? imgSrc : '/default-profile-pic.png'} />
            <div>
              {fname} {lname}
            </div>
          </MyInfo>
        </Link>
        <h2>Conversations</h2>
        <div className="search">
          <Form onSubmit={onSubmit}>
            <input
              type="text"
              onChange={onChange}
              placeholder={'Search convos...'}
            />
            <button>
              <img alt="search-icon" src={'/search.png'} />
            </button>
          </Form>
        </div>
        <div className="list-convos">
          {Object.keys(convoList).map((convoID, index) => {
            let userID = convoList[convoID].label;
            let name = convoUsers[userID].fname;
            let imgSrc = convoUsers[userID].imgSrc;
            if (notifications[userID] && currentConvo === convoID) {
              dispatch({ type: 'remove-notification', content: userID });
            }
            if (
              !filter === '' ||
              name.toUpperCase().includes(filter.toUpperCase())
            ) {
              return (
                <div key={'ConvoList' + index}>
                  <ListStyle
                    current={currentConvo === convoID}
                    onClick={() => getConvo(convoID, userID)}
                    notify={notifications[userID]}
                    active={activeMembers[userID]}
                  >
                    <div>
                      <img
                        alt=""
                        src={imgSrc ? imgSrc : '/default-profile-pic.png'}
                      />
                      <p>{name}</p>
                      <div className="notification"></div>
                    </div>
                  </ListStyle>
                </div>
              );
            }
            return <div key={'ConvoList' + index}></div>;
          })}
        </div>
      </div>
    </Container>
  );
};

export default ConvoList;
export { ListStyle };
