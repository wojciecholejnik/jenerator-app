const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const usersRoutes = require('./routes/users.routes');
const questionRoutes = require('./routes/questions.routes');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, './public/client')));


const dbURI = `mongodb+srv://pytania:pytaniaPassword@cluster0.bpoyn.mongodb.net/Pytania`;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => {});
db.once('error', () => {console.log('error')});

app.use('/api', usersRoutes);
app.use('/api', questionRoutes);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/client/index.html'));
});




const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log('Server is running on port: ' + port);
});