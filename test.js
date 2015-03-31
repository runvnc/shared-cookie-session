var express =require('express');

var sess = require('./index');

var app = express();

sess.setupAppServer(app);

var x = 0;

app.use(function (req, res, next) {
  var n = req.session.views || 0
  req.session.views = ++n
  x++
  res.end(n + ' views' + x.toString())
});


app.listen(3012);

