import React from 'react';
import { useSelector } from 'react-redux';
import { socket } from './../Home/Login';
import { useHistory } from 'react-router-dom';

let ActiveUsers = () => {
  const history = useHistory();
  let activeUsers = useSelector(state => state.activeUsers); // userID:{fname,image,description}
  let myID = useSelector(state => state.userInfo.email);
  let startConvo = userID => {
    console.log('start convo');
    let users = [userID, myID];
    socket.emit('startConvo', users);
    socket.on('send convo', (convoID, convo) => {
      history.push('/messenger/' + convoID);
    });
  };
  console.log('ActiveUsers.jsx');
  return (
    <div>
      {Object.keys(activeUsers).map((userID, index) => {
        return (
          <div key={index} onClick={() => startConvo(userID)}>
            {activeUsers[userID].fname}
          </div>
        );
      })}
    </div>
  );
};

export default ActiveUsers;
