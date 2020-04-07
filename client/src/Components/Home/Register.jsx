import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Form, { Title, E } from './FormStyle.jsx';
import styled from 'styled-components';
import { socket } from './Login.jsx';
const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

let Register = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [email, emailChange] = useState('');
  const [pw, pwChange] = useState('');
  const [confirmPw, confirmPwChange] = useState('');
  const [errMsg, errMsgChange] = useState('');
  const [fname, fnameChange] = useState('');
  const [lname, lnameChange] = useState('');

  let submitHandler = async evt => {
    evt.preventDefault();
    errMsgChange('');
    if (confirmPw !== pw) {
      errMsgChange("Passwords don't match!");
      return;
    } else {
      let data = new FormData();
      data.append('email', email);
      data.append('pw', pw);
      data.append('fname', fname);
      data.append('lname', lname);
      let responseBody = await fetch('/register', {
        method: 'POST',
        body: data
      });
      let responseText = await responseBody.text();
      let response = JSON.parse(responseText);
      if (response.success) {
        emailChange('');
        pwChange('');
        confirmPwChange('');
        fnameChange('');
        lnameChange('');
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
        errMsgChange(response.errorMessage);
      }
    }
  };
  return (
    <Form onSubmit={submitHandler}>
      <Title>
        <h1>Register</h1>
      </Title>
      <div className="row">
        <div>
          <label htmlFor="fname">First Name</label>
          <input
            type="text"
            id="fname"
            required
            autoComplete="on"
            value={fname}
            onChange={evt => {
              fnameChange(evt.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="lname">Last Name</label>
          <input
            type="text"
            id="lname"
            required
            autoComplete="on"
            value={lname}
            onChange={evt => {
              lnameChange(evt.target.value);
            }}
          />
        </div>
      </div>
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
      <div>
        <label htmlFor="confirmPw">Confirm password</label>
        <input
          type="password"
          id="confirmPw"
          required
          autoComplete="off"
          value={confirmPw}
          onChange={evt => {
            confirmPwChange(evt.target.value);
          }}
        />
      </div>

      <button>Create account</button>
      <E>{errMsg}</E>
    </Form>
  );
};

export default Register;
