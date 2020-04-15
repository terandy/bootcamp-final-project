import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Container, {
  Container2,
  ContactCover,
  ContactUserStyle,
  SearchUserStyle,
  ActiveUserStyle,
  Form,
  H1
} from './DiscoverStyled.jsx';

let Discover = () => {
  const history = useHistory();
  let activeUsers = useSelector(state => state.activeUsers); // userID:{fname,image,description}
  let convoUsers = useSelector(state => state.convoUsers);
  let me = useSelector(state => state.userInfo.email);
  let [searchInput, setSearchInput] = useState('');
  let [errorMsg, setErrorMsg] = useState('');
  let [searchResults, setSearchResults] = useState([]);
  let viewProfile = async userID => {
    let path = '';
    if (activeUsers[userID]) {
      path = activeUsers[userID]._id;
    } else {
      path = convoUsers[userID]._id;
    }
    history.push('/view-profile/' + path);
  };
  let submitHandler = async evt => {
    evt.preventDefault();
    if (searchInput === '') {
      setSearchResults([]);
      return;
    }
    let data = new FormData();
    data.append('searchInput', searchInput);
    let responseBody = await fetch('/searchQuery', {
      method: 'POST',
      body: data
    });
    let responseText = await responseBody.text();
    let response = JSON.parse(responseText);
    if (response.success) {
      setSearchInput('');
      console.log('results', response.results);
      if (response.results.length === 0) {
        setErrorMsg('No results found');
      }
      setSearchResults(response.results);
    } else {
      console.log('Did not find anything.');
    }
  };
  let changeHandler = evt => {
    if (errorMsg !== '') {
      setErrorMsg('');
    }
    setSearchInput(evt.target.value);
  };
  return (
    <div>
      <Form onSubmit={submitHandler}>
        <input
          placeholder="Find user..."
          type="text"
          onChange={changeHandler}
          value={searchInput}
        />
        <div className="button" onClick={submitHandler}>
          <img src="/search.png" />
        </div>
      </Form>
      <H1>
        <Container>
          <div className="err">{errorMsg}</div>
          {searchResults.map((user, index) => {
            return (
              <SearchUserStyle
                onClick={() => history.push('/view-profile/' + user._id)}
                key={'searched-user' + index}
              >
                <img
                  alt=""
                  src={user.imgSrc ? user.imgSrc : '/default-profile-pic.png'}
                />
                <div className="info">
                  <h2>{user.fname + ' ' + user.lname}</h2>
                  <p>{user.description}</p>
                </div>
                <div className="cover">View Profile</div>
              </SearchUserStyle>
            );
          })}
        </Container>
      </H1>
      <H1>
        {Object.keys(activeUsers).length > 1 ? <h1>Currently online</h1> : ''}
        <Container>
          {Object.keys(activeUsers).map((userID, index) => {
            if (userID !== me) {
              return (
                <ActiveUserStyle key={'active-user' + index}>
                  <img
                    alt=""
                    src={
                      activeUsers[userID].imgSrc
                        ? activeUsers[userID].imgSrc
                        : '/default-profile-pic.png'
                    }
                  />
                  <div className="info">
                    <p>{activeUsers[userID].fname}</p>
                    <button onClick={() => viewProfile(userID)}>
                      View Profile
                    </button>
                  </div>
                </ActiveUserStyle>
              );
            } else {
              return <div key={'non-active-user' + index}></div>;
            }
          })}
        </Container>
      </H1>
      <H1>
        <h1>Your Contacts</h1>
        <Container2>
          {Object.keys(convoUsers).map((userID, index) => {
            if (userID !== me) {
              return (
                <ContactUserStyle
                  onClick={() => viewProfile(userID)}
                  key={'convo-user' + index}
                >
                  <img
                    alt=""
                    src={
                      convoUsers[userID].imgSrc
                        ? convoUsers[userID].imgSrc
                        : '/default-profile-pic.png'
                    }
                  />
                  <ContactCover className="cover">
                    <h1>{convoUsers[userID].fname}</h1>
                  </ContactCover>
                </ContactUserStyle>
              );
            } else {
              return <div key={'non-active-user' + index}></div>;
            }
          })}
        </Container2>
      </H1>
    </div>
  );
};

export default Discover;
