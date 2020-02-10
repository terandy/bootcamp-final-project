const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/login', (req, res) => {
  return res.json({ success: true, endpoint: '/login' }); //<--is equivalent to res.send(JSON.stringify({ success: true }))
});

app.listen(4000, () => {
  console.log('server running!');
});
