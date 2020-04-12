import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Form, { Title, E } from './FormStyle.jsx';
import io from 'socket.io-client';
const socket = io(window.location.origin, {
  autoConnect: false
});

let Login = props => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [loginEmail, loginEmailChange] = useState('');
  const [loginPw, loginPwChange] = useState('');
  const [errorMessage, errChange] = useState('');

  let submitHandler = async evt => {
    evt.preventDefault();
    let data = new FormData();
    data.append('email', loginEmail);
    data.append('pw', loginPw);
    let responseBody = await fetch('/login', { method: 'POST', body: data });
    let responseText = await responseBody.text();
    let response = JSON.parse(responseText);
    if (response.success) {
      dispatch({
        type: 'login',
        content: {
          userInfo: response.userInfo,
          activeUsers: response.activeUsers,
          convoList: response.convoList,
          convoUsers: response.convoUsers
        }
      });
      socket.connect();
      socket.emit('login', response.userInfo);
      history.push('/');
    } else {
      errChange(response.errorMessage);
    }
  };
  return (
    <Form onSubmit={submitHandler}>
      <Title>
        <h1>Sign in</h1>
      </Title>
      <div>
        <label htmlFor="loginEmail">Email</label>
        <input
          type="text"
          id="loginEmail"
          required
          autoComplete="on"
          value={loginEmail}
          onChange={evt => {
            loginEmailChange(evt.target.value);
          }}
        />
      </div>
      <div>
        <label htmlFor="loginPw">Password</label>
        <input
          type="password"
          id="loginPw"
          required
          autoComplete="off"
          value={loginPw}
          onChange={evt => {
            loginPwChange(evt.target.value);
          }}
        />
      </div>

      <button>Sign in</button>
      <E>{errorMessage}</E>
    </Form>
  );
};

export default Login;
export { socket };
