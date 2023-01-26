const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const usersRoutes = require('./routes/users.routes');
const questionRoutes = require('./routes/questions.routes');
const testRoutes = require('./routes/test.routes');
const categoriesRoutes = require('./routes/categories.routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, '/public/client')));
app.use(express.static(path.join(__dirname, '/public/uploads')));

mongoose.set("strictQuery", false);
const dbURI = `mongodb+srv://pytania:pytaniaPassword@cluster0.bpoyn.mongodb.net/Pytania?retryWrites=true&w=majority`;
mongoose.connect(dbURI);
const db = mongoose.connection;
db.once('open', () => {console.log('DB connected')});
db.once('error', () => {console.warn('DB conection error')});


app.use('/api', usersRoutes);
app.use('/api', questionRoutes);
app.use('/api', testRoutes);
app.use('/api', categoriesRoutes);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/client/index.html'));
});

const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log('Server is running on port: ' + port);
});