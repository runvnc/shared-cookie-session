var fs = require('fs');
var crypto = require('crypto');
var bcrypt = require('bcryptjs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var randomstring = require('randomstring');

var configPath = process.env.HOME + '/.pass-fs-cookie';

readConfig = function(cb) {
  var fname = configPath+'/config.json';  
  fs.exists(fname, function(exists) {
    if (exists) {
      fs.readFile(fname, 'utf8', function (err, data) {
        if (err) throw err;
        var conf = JSON.parse(data);
        cb(conf);
      });
    } else {
      var data = {
        cookieSecret: crypto.randomBytes(64).toString(),
        cookieParserRandom: randomstring.generate()
      };
      fs.writeFile(fname, JSON.stringify(data), function (err) {
        if (err) throw err;
        cb(data);
      });
    }
}

module.exports.setupAppServer = function(app, callback) {
  readConfig(function(config) {
    app.use(cookieParser(config.cookieParserRandom));
    app.use(cookieSession({
      secret: config.cookieSecret,
      maxage: 1000 * 60 * 60 * 24 * 7,
      signed: true
    }));
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(function (req, res, next) {
      if (req.url === '/login' || req.isAuthenticated()) {
        return next();
      } else {
        res.redirect("/login");
      }
    });

    callback();
  });
};

