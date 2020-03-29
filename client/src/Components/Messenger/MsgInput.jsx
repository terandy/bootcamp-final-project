import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { socket } from './../Home/Login';
import { MsgInputStyle } from './MsgInputStyle.jsx';
import { Link } from 'react-router-dom';
// import createOffer from '../../createOffer.js';

let MsgInput = props => {
  let formRef = useRef();
  let convoID = props.convoID;
  let [msgContent, setMsgContent] = useState('');
  let user = useSelector(state => state.userInfo.email);
  let convo = useSelector(state => state.conversations[convoID]);

  let submitHandler = async evt => {
    evt.preventDefault();
    socket.emit('new message', user, msgContent, convoID, convo.members);
    setMsgContent('');
    return;
  };

  let onChangeHandler = evt => {
    setMsgContent(evt.target.value);
    return;
  };
  let onEnterSubmit = evt => {
    if (evt.keyCode === 13) {
      submitHandler(evt);
    }
  };
  return (
    <MsgInputStyle onSubmit={submitHandler} ref={formRef}>
      <div>+</div>
      <Link to={'/video-chat/' + convoID}>
        <img alt="video-chat" src={'/video-chat.png'} />
      </Link>
      <textarea
        rows="1"
        type="text"
        value={msgContent}
        onChange={onChangeHandler}
        onKeyDown={onEnterSubmit}
        placeholder="Type a message..."
      />
      <button>
        <img alt="send" src={'/send-button.png'} />
      </button>
    </MsgInputStyle>
  );
};

export default MsgInput;
