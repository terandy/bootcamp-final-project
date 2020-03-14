const app = require('express')();
const multer = require('multer');
const upload = multer({ dest: '../client/public/uploads/' });
const server = require('http').Server(app);
const io = require('socket.io')(server);
const sha1 = require('sha1');
const MongoClient = require('mongodb').MongoClient;
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
      dbo.collection('users').insertOne({
        email: email,
        password: sha1(pw),
        fname: fname,
        lname: lname,
        type: 'patient'
      });
      dbo
        .collection('conversations')
        .find({ members: email })
        .toArray()
        .then(results => {
          let convoList = {};
          if (results) {
            results.forEach(convo => {
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
            convoList: convoList
          });
        });
    } else {
      res.json({
        success: false,
        errorMessage: 'Username taken'
      });
    }
  });
});

app.post('/edit-profile', upload.single('imgSrc'), (req, res) => {
  dbo.collection('users').updateOne(
    { email: req.body.email },
    {
      $set: {
        description: req.body.description,
        imgSrc: req.body.imgSrc
      }
    }
  );
  dbo
    .collection('users')
    .findOne({ email: req.body.email })
    .then(results => res.json({ success: true, userInfo: results }));
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
      res.json({ success: true, convoID: results.convoID });
    })
    .catch(err => {
      //create conversation in mongoDB
      dbo.collection('conversations').insertOne(newConvo);
      users.forEach(user => {
        res.json({ success: true, convoID: convoID });
      });
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
    let newConvo = { convoID: convoID, messages: [], members: users };
    users.forEach(user => {
      io.to(sockets[user]).emit('new convo', convoID, newConvo);
    });
  });

  socket.on('getConvo', convoID => {
    dbo
      .collection('conversations')
      .findOne({ convoID: convoID })
      .then(results => {
        socket.emit('send convo', convoID, results);
      });
  });
  socket.on('make-offer', (offer, members, convoID, offerer) => {
    console.log('server.js socket.on(make-offer)');
    console.log('offerer', offerer);
    members.forEach(member => {
      console.log('member', member);
      if (member !== offerer) {
        console.log('offer-made emitting');
        console.log('to', member);
        socket
          .to(sockets[member])
          .emit('offer-made', offer, members, convoID, offerer, member);
      }
    });
  });
  socket.on('make-answer', (answer, members, convoID, offerer, reciever) => {
    console.log('server.js socket.on(make-answer)');
    socket
      .to(sockets[offerer])
      .emit('answer-made', answer, members, convoID, offerer, reciever);
  });

  socket.on('new message', (sender, content, convoID, members) => {
    let time = Date();
    members.forEach(member => {
      io.to(sockets[member]).emit(
        'get message',
        convoID,
        sender,
        content,
        time,
        members
      );
    });
    dbo.collection('conversations').updateOne(
      { convoID: convoID },
      {
        $push: { messages: { sender: sender, content: content, time } }
      }
    );
  });
  socket.on('logout', userID => {
    delete activeUsers[userID];
    delete sockets[userID];
    io.emit('active logout', userID);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected: ', socket.id);
  });
});

server.listen(5000);
