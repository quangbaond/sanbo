require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var binanceRouter = require('./routes/binance');
var symbolRouter = require('./routes/symbol');
var authRouter = require('./routes/auth');
var roomRouter = require('./routes/room');
var tradeRouter = require('./routes/trade');
var uploadRouter = require('./routes/upload');
var bankRouter = require('./routes/bank');
var transactionRouter = require('./routes/transaction');
var sessionRouter = require('./routes/session');
var app = express();
app.use(cors({
  origin: process.env.URL_CLIENT.split(','),
  // credentials: true
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/binance', binanceRouter);
app.use('/symbols', symbolRouter);
app.use('/auth', authRouter);
app.use('/trade', tradeRouter);
app.use('/room', roomRouter);
app.use('/upload', uploadRouter);
app.use('/bank', bankRouter);
app.use('/transaction', transactionRouter);
app.use('/session', sessionRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// create websocket


module.exports = app;
