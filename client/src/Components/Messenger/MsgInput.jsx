import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { socket } from './../Home/Login';
import { MsgInputStyle } from './MsgInputStyle.jsx';

let MsgInput = props => {
  let convoID = props.convoID;
  let [msgContent, setMsgContent] = useState('');
  let user = useSelector(state => state.userInfo.email);
  let members = useSelector(state => state.conversations[convoID].members);

  let submitHandler = async evt => {
    evt.preventDefault();
    socket.emit('new message', user, msgContent, convoID, members);
    setMsgContent('');
    return;
  };

  let onChangeHandler = evt => {
    setMsgContent(evt.target.value);
    return;
  };
  return (
    <MsgInputStyle onSubmit={submitHandler}>
      <div>+</div>
      <div>x</div>
      <textarea
        rows="1"
        type="text"
        value={msgContent}
        onChange={onChangeHandler}
        placeholder="Type a message..."
      />
      <button>send</button>
    </MsgInputStyle>
  );
};

export default MsgInput;
