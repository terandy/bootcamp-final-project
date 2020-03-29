import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { ListStyle } from './ConvoList.jsx';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar.jsx';

let Container = styled.div`
  background-color: white;
  border-bottom: lightgrey 1px solid;
  overflow: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .search {
    padding: 0;
    padding-right: 1em;
  }
`;

let MsgDetail = props => {
  let thisConvoID = props.convoID;
  let me = useSelector(state => state.userInfo.email);
  let convoList = useSelector(state => state.convoList);
  let convoUsers = useSelector(state => state.convoUsers);
  let members = convoList[thisConvoID] ? convoList[thisConvoID].members : [];
  let otherMembers = members.filter(user => {
    return user !== me;
  });
  if (!convoList) {
    return <div></div>;
  }

  return (
    <Container>
      {otherMembers.map((user, index) => {
        let name = convoUsers[user].fname;
        let imgSrc = convoUsers[user].imgSrc;
        return (
          <ListStyle key={index}>
            <Link to={'/view-profile/' + convoUsers[user]._id}>
              <div>
                <img
                  alt=""
                  src={imgSrc ? imgSrc : '/default-profile-pic.png'}
                />
                <p>{name}</p>
              </div>
            </Link>
          </ListStyle>
        );
      })}
    </Container>
  );
};

export default MsgDetail;
