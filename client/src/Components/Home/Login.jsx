import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Form, { Title, E } from './FormStyle.jsx';
import styled from 'styled-components';
import io from 'socket.io-client';
const socket = io('localhost:5000', {
  autoConnect: false
});
const FormLogin = styled(Form)`
  right: 0;
  left: auto;
`;
let Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [email, emailChange] = useState('');
  const [pw, pwChange] = useState('');
  const [errorMessage, errChange] = useState('');

  let submitHandler = async evt => {
    evt.preventDefault();
    let data = new FormData();
    data.append('email', email);
    data.append('pw', pw);
    let responseBody = await fetch('/login', { method: 'POST', body: data });
    let responseText = await responseBody.text();
    let response = JSON.parse(responseText);
    if (response.success) {
      console.log('logged in!');
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
      console.log('error', errorMessage);
      errChange(response.errorMessage);
    }
  };
  return (
    <FormLogin onSubmit={submitHandler}>
      <Title>
        <h1>Sign in</h1>
      </Title>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          required
          autoComplete="on"
          value={email}
          onChange={evt => {
            emailChange(evt.target.value);
          }}
        />
      </div>
      <div>
        <label htmlFor="pw">Password</label>
        <input
          type="password"
          id="pw"
          required
          autoComplete="off"
          value={pw}
          onChange={evt => {
            pwChange(evt.target.value);
          }}
        />
      </div>

      <button>Sign in</button>
      <E>{errorMessage}</E>
    </FormLogin>
  );
};

export default Login;
export { socket };
