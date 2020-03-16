import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import styled from 'styled-components';

let MyInfo = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0.5em;
  img {
    height: 4em;
    width: 4em;
    border-radius: 50%;
    margin-right: 0.5em;
    object-fit: cover;
  }
`;
let Container = styled.div`
  box-sizing: border-box;
  padding: 0.5em;
  .box {
    box-sizing: border-box;
    background-color: white;
    height: 100%;
    border-radius: 0.5em;
    padding: 0.5em;
    h2 {
      font-size: 1em;
    }
    a {
      width: 100%;
      display: block;
    }
  }
`;

let ListStyle = styled.div`
  div {
    border-radius: 1em;
    background-color: ${props =>
      props.current ? 'rgb(240, 240, 240)' : 'transparent'};
    color: ${props => (props.current ? 'rgb(120, 120, 120)' : 'black')};
    display: flex;
    align-items: center;
    padding: 0 1em;
    p {
      background-color: transparent;
    }
    &:hover {
      cursor: pointer;
      background-color: rgb(250, 250, 250);
    }
    img {
      height: 2em;
      width: 2em;
      border-radius: 50%;
      margin-right: 1em;
      object-fit: cover;
    }
  }
`;

let ConvoList = props => {
  const history = useHistory();
  const dispatch = useDispatch();
  let convoList = useSelector(state => state.convoList);
  let loggedIn = useSelector(state => state.login);
  let convoUsers = useSelector(state => state.convoUsers);
  let currentConvo = useSelector(state => state.currentConvo);
  let imgSrc = useSelector(state => state.userInfo.imgSrc);
  let fname = useSelector(state => state.userInfo.fname);
  let lname = useSelector(state => state.userInfo.lname);
  let getConvo = convoID => {
    dispatch({ type: 'set-current-convo', content: convoID });
    history.push('/messenger/' + convoID);
  };
  if (!convoList) {
    return <div></div>;
  }
  return (
    <Container loggedIn={loggedIn}>
      <div className="box">
        <MyInfo>
          <img alt="" src={imgSrc ? imgSrc : '/default-profile-pic.png'} />
          <div>
            {fname} {lname}
          </div>
        </MyInfo>
        <h2>Conversations</h2>
        {Object.keys(convoList).map((convoID, index) => {
          let name = convoUsers[convoList[convoID].label].fname;
          let imgSrc = convoUsers[convoList[convoID].label].imgSrc;
          return (
            <div key={'ConvoList' + index}>
              <ListStyle
                current={currentConvo === convoID}
                onClick={() => getConvo(convoID)}
              >
                <div>
                  <img
                    alt=""
                    src={imgSrc ? imgSrc : '/default-profile-pic.png'}
                  />
                  <p>{name}</p>
                </div>
              </ListStyle>
              <Link to={'/video-chat/' + convoID}>video</Link>
            </div>
          );
        })}
      </div>
    </Container>
  );
};

export default ConvoList;
export { ListStyle };
