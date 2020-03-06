import React from 'react';
import { useSelector } from 'react-redux';
import { socket } from './../Home/Login';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
let H1 = styled.h1`
  margin: 0.5em;
`;
let ActiveUserStyle = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 1em;
  padding: 0.5em;
  margin: 0.5em;
  &:hover {
    cursor: pointer;
  }
  img {
    border-radius: 50%;
    height: 3em;
    width: 3em;
    object-fit: cover;
    margin-right: 0.5em;
  }
`;
let ActiveUsers = () => {
  const history = useHistory();
  let activeUsers = useSelector(state => state.activeUsers); // userID:{fname,image,description}
  let myID = useSelector(state => state.userInfo.email);
  let startConvo = async userID => {
    let users = [userID, myID];
    let data = new FormData();
    users.forEach(user => data.append('users', user));
    let responseBody = await fetch('/get-convoID', {
      method: 'POST',
      body: data
    });
    let responseText = await responseBody.text();
    let response = JSON.parse(responseText);
    if (response.success) {
      history.push('/messenger/' + response.convoID);
      if (response.new) {
        socket.emit('startConvo', users, response.convoID);
      }
    }
  };
  return (
    <div>
      <H1>Active Users</H1>
      {Object.keys(activeUsers).map((userID, index) => {
        return (
          <ActiveUserStyle key={index} onClick={() => startConvo(userID)}>
            <img alt="" src={activeUsers[userID].imgSrc} />
            <div>{activeUsers[userID].fname}</div>
          </ActiveUserStyle>
        );
      })}
    </div>
  );
};

export default ActiveUsers;
