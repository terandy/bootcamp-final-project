import { createStore } from 'redux';
import produce from 'immer';

let initialState = {
  login: false,
  userInfo: {}, // fname,email,description,type,image
  conversations: {}, // convoID:{members,messages}, members=[userID,..], messages=[{content,sender,time},..]
  activeUsers: {}, // userID:{fname,image,description}
  convoList: {}, // convoID:{label,members}
  convoUsers: {},
  currentConvo: '',
  streams: [],
  displayDialog: { set: false, convoID: '' }
};

let reducer = (state, action) => {
  const newState = produce(state, newState => {
    switch (action.type) {
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
        newState.login = true;
        newState.conversations[ac.convoID] = ac.convo;
        newState.convoList[ac.convoID] = {
          label: label,
          members: ac.convo.members
        };
        break;
      case 'logout':
        return initialState;
      case 'active-login':
        newState.activeUsers[action.content.email] = action.content;
        break;
      case 'active-logout':
        delete newState.activeUsers[action.content];
        break;
      case 'set-display-dialog':
        newState.displayDialog = {
          set: action.content.set,
          convoID: action.content.convoID
        };
        break;
      case 'get-message':
        newState.conversations[action.content.convoID].messages.push({
          sender: action.content.sender,
          content: action.content.content,
          time: action.content.time
        });
        break;
      case 'add-stream':
        newState.streams.push(action.content);
        break;
      case 'add-video-link':
        break;
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
