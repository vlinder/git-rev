var exec = require('child_process').exec
var execSync = require('child_process').execSync;

function _command (cmd, dir, cb) {
  if (typeof dir === 'function') cb = dir, dir = __dirname
  exec(cmd, { cwd: dir }, function (err, stdout, stderr) {
    if (err) {
      return cb(err)
    }
    cb(null, stdout.split('\n').join(''))
  })
}

function _commandSync(cmd, dir) {
  if(typeof dir === 'undefined') dir = __dirname;
  try {
    return execSync(cmd, {cwd: dir, encoding: 'utf8'}).split('\n').join('');
  }
  catch(e) {
    return '';
  }
}

module.exports = {
    short : _command.bind(null, 'git rev-parse --short HEAD')
  , long : _command.bind(null, 'git rev-parse HEAD')
  , branch : _command.bind(null, 'git rev-parse --abbrev-ref HEAD')
  , tag : _command.bind(null, 'git describe --always --tag --abbrev=0')
  , describe : _command.bind(null, 'git describe --tags --always')
  , log : function (dir, cb) {
      if (typeof dir === 'function') cb = dir, dir = __dirname
      _command('git log --no-color --pretty=format:\'[ "%H", "%s", "%cr", "%an" ],\' --abbrev-commit', dir, function (err, str) {
        if (err) return cb(err)
        str = str.substr(0, str.length-1)
        cb(null, JSON.parse('[' + str + ']'))
      })
    }
  , shortSync : _commandSync.bind(null, 'git rev-parse --short HEAD')
  , longSync : _commandSync.bind(null, 'git rev-parse HEAD')
  , branchSync : _commandSync.bind(null, 'git rev-parse --abbrev-ref HEAD')
  , tagSync : _commandSync.bind(null, 'git describe --always --tag --abbrev=0')
  , describeSync : _commandSync.bind(null, 'git describe --tags --always')
  , logSync: function(dir, cb) {
      if(typeof dir === 'function') cb = dir, dir = __dirname;
      _commandSync('git log --no-color --pretty=format:\'[ "%H", "%s", "%cr", "%an" ],\' --abbrev-commit',
          dir,
          function(err, str) {
              if(err) return cb(err);
              str = str.substr(0, str.length - 1);
              cb(null, JSON.parse('[' + str + ']'));
          })
    }
}
