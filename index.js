var fs = require('fs-extra');
var crypto = require('crypto');
var cookieSession = require('cookie-session');
var randomstring = require('randomstring');

var configPath = process.env.HOME + '/.pass-fs-cookie';

readConfig = function() {
  var fname = configPath+'/config.json';  
  var exists = fs.existsSync(fname);
  if (exists) {
    var data = fs.readFileSync(fname, 'utf8'); 
    var conf = JSON.parse(data);
    return conf;
  } else {
    var data = {
      cookieSecret: crypto.randomBytes(64).toString(),
      cookieParserRandom: randomstring.generate()
    };
    fs.outputFileSync(fname, JSON.stringify(data));
    return data; 
  }
}

module.exports.session = null;

module.exports.setupAppServer = function(app) {
  var config = readConfig();
  app.use(cookieSession({
      secret: config.cookieSecret,
      maxage: 1000 * 60 * 60 * 24 * 7,
      signed: true
    }));

  app.use(function(req,res,next) {
    module.exports.session = req.session;
    process.session = req.session;
  });
};

