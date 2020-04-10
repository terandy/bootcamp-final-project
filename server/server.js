const express = require('express');
const app = express();
const multer = require('multer');
// const upload = multer({ dest: __dirname + '/build/uploads/' });
const upload = multer({ dest: '../client/public/uploads/' });
const server = require('http').Server(app);
const io = require('socket.io')(server);
const sha1 = require('sha1');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
let cookieParser = require('cookie-parser');
app.use(cookieParser());

// Database;
let dbo = undefined;
const url =
  'mongodb+srv://terandy:pw@cluster0-zo8n8.mongodb.net/test?retryWrites=true&w=majority';
MongoClient.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, db) => {
    dbo = db.db('media-board');
    if (err) {
      console.log('ERROR', err);
    }
  }
);
//Storage
let activeUsers = {};
let sockets = {};
let sessions = {};
let videoChats = {};

// app.use(express.static(__dirname + '/build'));
app.get('/', (req, res) => {
  res.send('server is running....');
});
app.post('/logout', upload.none(), (req, res) => {
  delete sessions[req.cookies.sid];
  res.json({ success: true });
});
app.post('/login', upload.none(), (req, res) => {
  let email = req.body.email;
  let pw = req.body.pw;
  dbo
    .collection('users')
    .findOne({ email: email })
    .then(userInfo => {
      if (userInfo.password === sha1(pw)) {
        activeUsers[userInfo.email] = userInfo;
        dbo
          .collection('conversations')
          .find({ members: email })
          .toArray()
          .then(results => {
            let convoList = {};
            let convoMembers = [];
            if (results) {
              results.forEach(convo => {
                convo.members.forEach(member => {
                  if (member !== email) {
                    convoMembers.push(member);
                  }
                });
                let label =
                  convo.members[0] === email
                    ? convo.members[1]
                    : convo.members[0];
                convoList[convo.convoID] = {
                  label: label,
                  members: convo.members
                };
              });
            }
            dbo
              .collection('users')
              .find({ email: { $in: convoMembers } })
              .toArray()
              .then(results => {
                let convoUsers = {};
                results.forEach(user => {
                  convoUsers[user.email] = user;
                });
                let sessionId = '' + Math.floor(Math.random() * 100000000);
                sessions[sessionId] = email;
                res.cookie('sid', sessionId);
                res.json({
                  success: true,
                  userInfo: userInfo,
                  activeUsers: activeUsers,
                  convoList: convoList,
                  convoUsers: convoUsers
                });
              });
          });
      } else {
        res.json({ success: false, errorMessage: 'wrong password' });
      }
    })
    .catch(err => {
      res.json({ success: false, errorMessage: 'email no found' });
    });
});
app.post('/register', upload.none(), (req, res) => {
  let email = req.body.email;
  let pw = req.body.pw;
  let fname = req.body.fname;
  let lname = req.body.lname;
  dbo.collection('users').findOne({ email: email }, (err, userInfo) => {
    if (!userInfo) {
      dbo
        .collection('users')
        .insertOne({
          email: email,
          password: sha1(pw),
          fname: fname,
          lname: lname,
          type: 'patient'
        })
        .then(results => {
          activeUsers[email] = { email, fname, lname, _id: results.insertedId };
        });
      let sessionId = '' + Math.floor(Math.random() * 100000000);
      sessions[sessionId] = email;
      res.cookie('sid', sessionId);
      res.json({
        success: true,
        userInfo: {
          email: email,
          password: sha1(pw),
          fname: fname,
          lname: lname,
          type: 'patient'
        },
        activeUsers: activeUsers,
        convoList: {},
        convoUsers: {}
      });
    } else {
      res.json({
        success: false,
        errorMessage: 'Username taken'
      });
    }
  });
});

app.post('/check-cookies', upload.none(), (req, res) => {
  let sid = req.cookies.sid;
  if (sessions[sid]) {
    let email = sessions[sid];
    dbo
      .collection('users')
      .findOne({ email: email })
      .then(userInfo => {
        activeUsers[userInfo.email] = userInfo;
        dbo
          .collection('conversations')
          .find({ members: email })
          .toArray()
          .then(results => {
            let convoList = {};
            let convoMembers = [];
            if (results) {
              results.forEach(convo => {
                convo.members.forEach(member => {
                  if (member !== email) {
                    convoMembers.push(member);
                  }
                });
                let label =
                  convo.members[0] === email
                    ? convo.members[1]
                    : convo.members[0];
                convoList[convo.convoID] = {
                  label: label,
                  members: convo.members
                };
              });
            }
            dbo
              .collection('users')
              .find({ email: { $in: convoMembers } })
              .toArray()
              .then(results => {
                let convoUsers = {};
                results.forEach(user => {
                  convoUsers[user.email] = user;
                });
                res.json({
                  success: true,
                  userInfo: userInfo,
                  activeUsers: activeUsers,
                  convoList: convoList,
                  convoUsers: convoUsers
                });
              });
          });
      });
  }
});
app.post('/get-convoID', upload.none(), (req, res) => {
  let users = req.body.users;
  let convoID = sha1(users.join(''));
  let newConvo = { convoID: convoID, messages: [], members: users };
  dbo
    .collection('conversations')
    .findOne({ members: { $all: users } })
    .then(results => {
      //conversation already exists, just go to page
      res.json({ success: true, new: false, convoID: results.convoID });
    })
    .catch(err => {
      //create conversation in mongoDB
      dbo.collection('conversations').insertOne(newConvo);
      res.json({
        success: true,
        convoID: convoID,
        new: true,
        newConvo: newConvo
      });
    });
});

app.post('/get-userInfo', upload.none(), (req, res) => {
  let userID = req.body.userID;
  dbo
    .collection('users')
    .findOne({ _id: new ObjectID(userID) })
    .then(results => {
      res.json({ success: true, userInfo: results });
    })
    .catch(err => {
      console.log('ERROR', err);
    });
});
app.post('/get-active-users', upload.none(), (req, res) => {
  res.json({ success: true, activeUsers: activeUsers });
});

app.post('/edit-profile-img', upload.single('imgSrc'), (req, res) => {
  let sid = req.cookies.sid;
  let userID = req.body.userID;
  if (sessions[sid] && sessions[sid] === userID) {
    let imgSrc = '/uploads/' + req.file.filename;
    dbo.collection('users').updateOne(
      { email: userID },
      {
        $set: {
          imgSrc: imgSrc
        }
      }
    );
    activeUsers[userID].imgSrc = imgSrc;
    res.send(JSON.stringify({ success: true, imgSrc: imgSrc }));
    return;
  } else {
    res.send(JSON.stringify({ success: false }));
  }
});
app.post('/edit-profile', upload.none(), (req, res) => {
  let sid = req.cookies.sid;
  let userID = req.body.userID;
  let fname = req.body.fname;
  let lname = req.body.lname;
  let description = req.body.description;
  if (sessions[sid] && sessions[sid] === userID) {
    dbo.collection('users').updateOne(
      { email: userID },
      {
        $set: {
          fname: fname,
          lname: lname,
          description: description
        }
      }
    );
    activeUsers[userID].fname = fname;
    activeUsers[userID].lname = lname;
    activeUsers[userID].description = description;
    res.send(JSON.stringify({ success: true }));
    return;
  } else {
    res.send(JSON.stringify({ success: false }));
  }
});

io.on('connection', socket => {
  console.log('user connected:', socket.id);

  socket.on('user-edit', userID => {
    socket.broadcast.emit('active-user-edit', activeUsers[userID]);
  });

  socket.on('login', userInfo => {
    sockets[userInfo.email] = socket.id;
    socket.broadcast.emit('active login', userInfo);
  });

  socket.on('reload', userInfo => {
    sockets[userInfo.email] = socket.id;
  });

  socket.on('startConvo', (users, convoID) => {
    let newConvo = { convoID: convoID, messages: [], members: users };
    dbo
      .collection('users')
      .find({ email: { $in: users } })
      .toArray()
      .then(results => {
        results.forEach(user => {
          io.to(sockets[user.email]).emit(
            'new convo',
            convoID,
            newConvo,
            results //Array of member info
          );
        });
      });
  });

  socket.on('getConvo', convoID => {
    dbo
      .collection('conversations')
      .findOne({ convoID: convoID })
      .then(convo => {
        dbo
          .collection('users')
          .find({ email: { $in: convo.members } })
          .toArray()
          .then(results => {
            socket.emit('send convo', convoID, convo, results);
          });
      });
  });

  socket.on('new message', (sender, content, convoID, members) => {
    let time = Date();
    dbo
      .collection('users')
      .find({ email: { $in: members } })
      .toArray()
      .then(results => {
        results.forEach(member => {
          io.to(sockets[member.email]).emit(
            'get message',
            convoID,
            sender,
            content,
            time,
            members,
            results //arrayOfMembersInfo
          );
        });
        dbo.collection('conversations').updateOne(
          { convoID: convoID },
          {
            $push: { messages: { sender: sender, content: content, time } }
          }
        );
      });
  });
  socket.on('logout', userID => {
    delete activeUsers[userID];
    delete sockets[userID];
    io.emit('active logout', userID);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected: ', socket.id);
  });

  //Video Chat
  socket.on('video-chat-start', (convoID, client) => {
    if (!videoChats[convoID]) {
      videoChats[convoID] = {
        initiator: '',
        connectedUsers: [client],
        members: []
      };
      //get list of convo members from database
      dbo
        .collection('conversations')
        .findOne({ convoID: convoID })
        .then(convo => {
          videoChats[convoID].members = convo.members;
          convo.members.forEach(member => {
            if (member !== client) {
              io.to(sockets[member]).emit('video-chat-start-invite', convoID);
            }
          });
        })
        .catch(err => console.log('ERROR', err));
    } else {
      videoChats[convoID].connectedUsers.push(client);
      //The last user to connect, is the initiator
      if (
        videoChats[convoID].connectedUsers.length ===
        videoChats[convoID].members.length
      ) {
        videoChats[convoID].members.forEach(member => {
          io.to(sockets[member]).emit('video-chat-initiator', client);
        });
      }
    }
  });
  socket.on('offer', (data, offerer, convoID) => {
    videoChats[convoID].members.forEach(answerer => {
      if (answerer !== offerer) {
        io.to(sockets[answerer]).emit(
          'offerBack',
          data,
          offerer,
          answerer,
          convoID
        );
      }
    });
  });
  socket.on('video-chat-decline', (convoID, decliner) => {
    videoChats[convoID].connectedUsers.forEach(user => {
      if (user !== decliner) {
        io.to(sockets[user]).emit('video-chat-decline-back', convoID, decliner);
      }
    });
  });
  socket.on('video-chat-leave', (convoID, client) => {
    videoChats[convoID].connectedUsers = videoChats[
      convoID
    ].connectedUsers.filter(user => user !== client);

    if (videoChats[convoID].connectedUsers.length === 0) {
      delete videoChats[convoID];
    }
  });
});

// app.get('/*', (req, res) => {
//   res.sendFile(__dirname + '/build/index.html');
// });
const { PORT = 5000, LOCAL_ADDRESS = '0.0.0.0' } = process.env;
server.listen(PORT, LOCAL_ADDRESS, () => {
  const address = server.address();
  console.log('server listening at', address);
});
