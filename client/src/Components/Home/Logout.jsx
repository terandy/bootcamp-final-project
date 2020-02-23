import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from './Login';

let Logout = props => {
  let dispatch = useDispatch();
  let userID = useSelector(state => state.userInfo.email);
  let logoutHandler = () => {
    dispatch({ type: 'logout', content: userID });
    socket.emit('logout', userID);
    socket.disconnect();
  };
  return (
    <Link to="/" onClick={logoutHandler}>
      Logout
    </Link>
  );
};

export default Logout;
