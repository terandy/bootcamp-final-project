import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from './Login';

let Logout = props => {
  let dispatch = useDispatch();
  let userID = useSelector(state => state.userInfo.email);
  let logoutHandler = async () => {
    socket.emit('logout', userID);
    socket.disconnect();
    let data = new FormData();
    data.append('userID', userID);
    let responseBody = await fetch('/logout', { method: 'POST', body: data });
    let responseText = await responseBody.text();
    let response = JSON.parse(responseText);
    if (response.success) {
      console.log('logged out!');
      dispatch({ type: 'logout', content: userID });
    }
  };
  return (
    <Link to="/" onClick={logoutHandler}>
      Logout
    </Link>
  );
};

export default Logout;
