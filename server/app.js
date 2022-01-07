const express = require('express');
const cors = require('cors');
const path = require('path');
//var cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const videosRouter = require('./routes/videos');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/videos', videosRouter);

module.exports = app;
