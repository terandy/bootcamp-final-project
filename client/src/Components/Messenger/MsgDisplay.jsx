import React from 'react';
import { useSelector } from 'react-redux';

let MsgDisplay = props => {
  let convoID = props.convoID;
  let convo = useSelector(state => state.conversations[convoID]);

  if (!convo) {
    return <div></div>;
  }
  return (
    <div>
      {convo.messages.map((msg, index) => {
        return (
          <div key={index}>
            <div>{msg.sender}</div>
            <div>{msg.content}</div>
            <div style={{ color: 'grey' }}>{msg.time}</div>
          </div>
        );
      })}
    </div>
  );
};

export default MsgDisplay;
