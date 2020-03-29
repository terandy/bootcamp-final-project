const app = require('express')();
const multer = require('multer');
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
      console.log('error', err);
    }
  }
);
//Storage
let activeUsers = {};
let sockets = {};
let sessions = {};
let clients = {};

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
          console.log('activeUsers', activeUsers);
          activeUsers[email] = { email, fname, lname, _id: results.insertedId };
          console.log('activeUsers', activeUsers);
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
  console.log('email', userID);
  dbo
    .collection('users')
    .findOne({ _id: new ObjectID(userID) })
    .then(results => {
      console.log('results', results);
      res.json({ success: true, userInfo: results });
    })
    .catch(err => {
      console.log('error', err);
    });
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
    console.log('hi');
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
    res.send(JSON.stringify({ success: true }));
    return;
  } else {
    res.send(JSON.stringify({ success: false }));
  }
});

io.on('connection', socket => {
  console.log('user connected:', socket.id);

  socket.on('login', userInfo => {
    sockets[userInfo.email] = socket.id;
    socket.broadcast.emit('active login', userInfo);
  });

  socket.on('reload', userInfo => {
    sockets[userInfo.email] = socket.id;
  });

  socket.on('startConvo', (users, convoID) => {
    console.log('startConvo');
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
    console.log('getConvo server.js');
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

  socket.on('NewClient', (convoID, user) => {
    console.log('NewClient');
    dbo
      .collection('conversations')
      .findOne({ convoID: convoID })
      .then(results => {
        let members = results.members;
        if (!clients[convoID]) {
          clients[convoID] = {};
          clients[convoID].members = members;
          clients[convoID].clients = [];
        }

        if (!clients[convoID].clients.includes(user)) {
          console.log('createPeer');
          console.log('socket.id', socket.id);
          socket.emit('CreatePeer');
          clients[convoID].clients.push(user);
          if (clients[convoID].clients.length === 1) {
            dbo
              .collection('users')
              .findOne({ email: user })
              .then(results => {
                members.forEach(member => {
                  console.log('startVideoChst');
                  socket
                    .to(sockets[member])
                    .emit('StartVideoChat', convoID, results.fname);
                });
              });
          }
        } else {
          socket.emit('SessionActive');
        }
      });
  });

  socket.on('Offer', (offer, convoID, user) => {
    console.log('Offer');
    clients[convoID].members.forEach(member => {
      if (member !== user) {
        socket.to(sockets[member]).emit('BackOffer', offer);
      }
    });
  });
  socket.on('Answer', (answer, convoID, user) => {
    console.log('Answer');
    clients[convoID].members.forEach(member => {
      if (member !== user) {
        socket.to(sockets[member]).emit('BackAnswer', answer);
      }
    });
  });

  socket.on('new message', (sender, content, convoID, members) => {
    console.log('new message');
    let time = Date();
    dbo
      .collection('users')
      .find({ email: { $in: members } })
      .toArray()
      .then(results => {
        results.forEach(member => {
          console.log('member', member);
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
  socket.on('LeaveChat', (otherUser, leaver, convoID) => {
    io.to(sockets[otherUser]).emit('leaveVideoChat');
    clients[convoID].clients = clients[convoID].clients.filter(
      user => user !== leaver
    );
  });
  socket.on('disconnect', () => {
    console.log('user disconnected: ', socket.id);
  });
});

server.listen(5000);
