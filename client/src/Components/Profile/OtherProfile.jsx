import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ProfileImg, BackgroundImg, Container, Info } from './profileStyle.jsx';
import styled from 'styled-components';
import { socket } from './../Home/Login';
let ProfileImg2 = styled(ProfileImg)`
  .container {
    &:hover {
      cursor: default;
    }
  }
`;
let Button = styled.div`
  color: rgb(33, 125, 183);
  position: absolute;
  display: flex;
  align-items: center;
  @media screen and (max-width: 500px) {
    right: 10px;
    top: 250px;
    flex-direction: column;
  }
  @media screen and (min-width: 500px) {
    right: 50px;
    top: 250px;
  }
  border: 1px solid transparent;
  &:hover {
    cursor: pointer;
    color: grey;
  }
  img {
    height: 40px;
    padding: 0.5em;
  }
`;
let OtherProfile = userID => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [chatSrcImg, changeChatSrcImg] = useState('/messages.png');
  let otherUserInfo = useSelector(state => state.otherUserInfo[userID.userID]);
  let myInfo = useSelector(state => state.userInfo);

  let startConvo = async userID => {
    let myID = myInfo.email;
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
      if (response.new) {
        socket.emit('startConvo', users, response.convoID);
      }
      dispatch({ type: 'set-current-convo', content: response.convoID });
      history.push('/messenger/' + response.convoID);
    }
  };

  useEffect(() => {
    let data = new FormData();
    data.append('userID', userID.userID);
    fetch('/get-userInfo', { method: 'POST', body: data })
      .then(responseBody => responseBody.text())
      .then(responseText => JSON.parse(responseText))
      .then(response => {
        if (response.success) {
          dispatch({ type: 'add-profile', content: response.userInfo });
        }
      });
  }, [userID.userID, dispatch]);

  if (!otherUserInfo) {
    return <h1>Loading...</h1>;
  }

  return (
    <Container>
      <BackgroundImg>
        <div className="container">
          <img alt="profile-img" src={'/background.jpg'} />
        </div>
      </BackgroundImg>
      <ProfileImg2>
        <div className="container">
          <img
            alt="profile-img"
            src={
              otherUserInfo.imgSrc
                ? otherUserInfo.imgSrc
                : '/default-profile-pic.png'
            }
          />
        </div>
      </ProfileImg2>
      <Info displayInfo={'info'}>
        <h2>
          {otherUserInfo.fname} {otherUserInfo.lname}
        </h2>
        <p>{otherUserInfo.description}</p>
      </Info>
      <Button
        onMouseEnter={() => changeChatSrcImg('/messages-grey.png')}
        onMouseLeave={() => changeChatSrcImg('/messages.png')}
        onClick={() => startConvo(otherUserInfo.email)}
      >
        Chat
        <img src={chatSrcImg} alt="start-chat-with-this-person-icon" />
      </Button>
    </Container>
  );
};

export default OtherProfile;
