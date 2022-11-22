const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const usersRoutes = require('./routes/users.routes');
const questionRoutes = require('./routes/questions.routes');
const testRoutes = require('./routes/test.routes');
const formidable = require('express-formidable');
const uniqid = require('uniqid');
const bodyParser = require('body-parser');

const app = express();
// app.use(formidable({uploadDir: './public/uploads/'}, [ 
//   {
//     event: 'fileBegin', // on every file upload...
//     action: (req, res, next, name, file) => {
//       const fileName = uniqid() + '.' + file.name.split('.')[ 1 ];
//       file.path = __dirname + '/public/uploads/photo_' + fileName; // ...move the file to public/uploads with unique name
//     }
//   }
// ]));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/client/build')));


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