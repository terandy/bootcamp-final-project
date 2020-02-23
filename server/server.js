const app = require('express')();
const upload = require('multer')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const sha1 = require('sha1');
const MongoClient = require('mongodb').MongoClient;

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

app.get('/', (req, res) => {
  res.send('server is running....');
});
app.post('/login', upload.none(), (req, res) => {
  console.log('login endpoint');
  let email = req.body.email;
  let pw = req.body.pw;
  console.log(pw);
  dbo
    .collection('users')
    .findOne({ email: email })
    .then(userInfo => {
      if (userInfo.password === sha1(pw)) {
        console.log('password match');
        activeUsers[userInfo.email] = userInfo;
        dbo
          .collection('conversations')
          .find({ members: email })
          .toArray()
          .then(results => {
            console.log(results);
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
            res.json({
              success: true,
              userInfo: userInfo,
              activeUsers: activeUsers,
              convoList: convoList
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

io.on('connection', socket => {
  console.log('user connected:', socket.id);
  socket.on('login', userInfo => {
    console.log('user logged in:', socket.id);
    console.log('email', userInfo.email);
    sockets[userInfo.email] = socket.id;
    io.emit('active login', userInfo);
  });
  socket.on('startConvo', users => {
    //users=array of members
    console.log('startConvo action');
    let convoID = sha1(users.join(''));
    let newConvo = { convoID: convoID, messages: [], members: users };
    dbo
      .collection('conversations')
      .findOne({ members: { $all: users } })
      .then(results => {
        //conversation already exists, just go to page
        console.log('alreadu exists');
        socket.emit('send convo', results.convoID, results);
      })
      .catch(err => {
        //create conversation in mongoDB
        dbo.collection('conversations').insertOne(newConvo);
        console.log('sockets', sockets);
        users.forEach(user => {
          console.log('okay created');
          console.log('sockID', sockets[user]);
          io.to(sockets[user]).emit('send convo', convoID, newConvo);
        });
      });
  });
  socket.on('getConvo', convoID => {
    console.log('getConvo action');
    dbo
      .collection('conversations')
      .findOne({ convoID: convoID })
      .then(results => {
        socket.emit('send convo', convoID, results);
      });
  });
  socket.on('new message', (sender, content, convoID, members) => {
    let time = Date.now();
    console.log('new message action');
    members.forEach(member => {
      io.to(sockets[member]).emit(
        'get message',
        convoID,
        sender,
        content,
        time
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
    io.emit('active logout', userID);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected: ', socket.id);
  });
});

server.listen(5000);
