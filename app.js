const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const usersRoutes = require('./routes/users.routes');
const questionRoutes = require('./routes/questions.routes');
const testRoutes = require('./routes/test.routes');
var Client = require('ssh2-sftp-client');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, '/public/client/')));
app.use(express.static(path.join(__dirname, '/documents/')));


const dbURI = `mongodb+srv://pytania:pytaniaPassword@cluster0.bpoyn.mongodb.net/Pytania`;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => {});
db.once('error', () => {console.log('error')});

app.use('/api', usersRoutes);
app.use('/api', questionRoutes);
app.use('/api', testRoutes);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/client/index.html'));
});

const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log('Server is running on port: ' + port);
});
// var sftp = new Client();
// sftp.connect({
//   host: '85.128.146.12',
//   port: 22 ,
//   username: 'server601294_jenerator',
//   password: 'Jenerator123',
// }).then(() => {
//   console.log('connected');
//   const port = process.env.PORT || 7000;
//   app.listen(port, () => {
//     console.log('Server is running on port: ' + port);
//   });
// })

// .catch(err => {
//   console.log(`Error: ${err.message}`); // error message will include 'example-client'
// });

