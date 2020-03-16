// import { socket } from './Components/Home/Login.jsx';
// const sessionDescription = window.RTCSessionDescription;
// const peerConnection = window.RTCPeerConnection;
// var pc = new peerConnection({
//   iceServers: [
//     {
//       url: 'stun:stun.services.mozilla.com'
//     }
//   ]
// });
// let error = err => {
//   console.log('error', err);
// };
// let createOffer = (convoID, members, offerer) => {
//   console.log('create offer');
//   pc.createOffer(offer => {
//     pc.setLocalDescription(
//       new sessionDescription(offer),
//       () => {
//         console.log('emit make-offer');
//         socket.emit('make-offer', offer, members, convoID, offerer);
//       },
//       error
//     );
//   }, error);
// };

// export default createOffer;
// export { error, pc, sessionDescription };
