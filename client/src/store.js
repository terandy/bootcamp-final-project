import { createStore } from 'redux';
import produce from 'immer';

let initialState = {
  login: false,
  userInfo: {}, // fname,email,description,type,image
  conversations: {}, // convoID:{members,messages}, members=[userID,..], messages=[{content,sender,time},..]
  activeUsers: {}, // userID:{fname,image,description}
  convoList: {}, // convoID:{label,members}
  convoUsers: {}, // userID :{userInformation} <--used in ConvoList
  currentConvo: '',
  notifications: {}, //{userID:boolean}

  videoChatMode: false, //if a video chat is open, do not display navbars
  videoChatInitiator: '', //
  videoChatInvite: { start: false, convoID: '' },
  peers: {}
};

let reducer = (state, action) => {
  const newState = produce(state, newState => {
    switch (action.type) {
      case 'edit-profile':
        newState.userInfo.fname = action.content.fname;
        newState.userInfo.lname = action.content.lname;
        newState.userInfo.description = action.content.description;
        break;
      case 'videoChatMode':
        newState.videoChatMode = action.content;
        break;
      case 'video-chat-start-invite':
        newState.videoChatInvite = {
          start: true,
          convoID: action.content.convoID
        };
        break;
      case 'video-chat-initiator':
        newState.videoChatInitiator = action.content.initiator;
        break;
      case 'reset-chat-start-invite':
        newState.videoChatInvite = { start: false, convoID: '' };
        newState.videoChatInitiator = '';
        break;
      case 'set-peer':
        newState.peers[action.content.user] = action.content.data;
        break;
      case 'destroy-peers':
        newState.peers = {};
        break;
      case 'login':
        newState.login = true;
        newState.userInfo = action.content.userInfo;
        newState.activeUsers = action.content.activeUsers;
        newState.convoList = action.content.convoList;
        newState.convoUsers = action.content.convoUsers;
        Object.keys(action.content.convoList).forEach(convoID => {
          newState.conversations[convoID] = { messages: [], members: [] };
        });
        break;
      case 'edit-profile-img':
        newState.userInfo.imgSrc = action.content.imgSrc;
        break;
      case 'set-current-convo':
        newState.currentConvo = action.content;
        break;
      case 'new-convo':
        let ac = action.content;
        let label;
        if (ac.convo.members[0] !== state.userInfo.email) {
          label = ac.convo.members[0];
        } else {
          label = ac.convo.members[1];
        }
        newState.notifications[label] = true;
        newState.conversations[ac.convoID] = ac.convo;
        newState.convoList[ac.convoID] = {
          label: label,
          members: ac.convo.members
        };

        ac.arrayOfMemberInfo.forEach(member => {
          if (member.info !== state.userInfo.email) {
            newState.convoUsers[member.email] = member;
          }
        });

        break;
      case 'active-login':
        newState.activeUsers[action.content.email] = action.content;
        break;
      case 'remove-notification':
        newState.notifications[action.content] = false;
        break;
      case 'active-logout':
        delete newState.activeUsers[action.content];
        break;
      case 'get-message':
        newState.conversations[action.content.convoID].messages.push({
          sender: action.content.sender,
          content: action.content.content,
          time: action.content.time
        });
        newState.notifications[action.content.sender] = true;
        break;
      case 'add-profile':
        newState.otherUserInfo[action.content._id] = action.content;
        break;
      case 'logout':
        return initialState;
      default:
        return state;
    }
  });
  return newState;
};

let store = createStore(
  reducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
export { reducer };
