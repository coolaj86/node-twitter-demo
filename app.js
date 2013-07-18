"use strict";
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , app = express()
  , config = require('./config')
  , user = { id: "abc" }
  , passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy
  , oa
  , twitterAuthn
  , twitterAuthz
  ;

  function initTwitterOauth() {
    var OAuth= require('oauth').OAuth
      ;

    oa = new OAuth(
      "https://twitter.com/oauth/request_token"
    , "https://twitter.com/oauth/access_token"
    , config.consumerKey
    , config.consumerSecret
    , "1.0A"
    , "http://local.coolaj86.com:3000/authn/twitter/callback"
    , "HMAC-SHA1"
    );
  }

  function makeTweet(cb) {
    oa.post(
      "https://api.twitter.com/1.1/statuses/update.json"
    , user.token
    , user.tokenSecret
    , {"status":"Test Tweet from NodeJS + OAuth"}
    , cb
    );
  }

  function makeDm(sn, cb) {
    oa.post(
      "https://api.twitter.com/1.1/direct_messages/new.json"
    , user.token
    , user.tokenSecret
    , {"screen_name": sn, text: "test message via nodejs twitter api. pulled your sn at random, sorry."}
    , cb
    );
  }

passport.serializeUser(function(_user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  done(null, user);
});

twitterAuthn = new TwitterStrategy({
    consumerKey: config.consumerKey
  , consumerSecret: config.consumerSecret
  , callbackURL: "http://local.coolaj86.com:3000/authn/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    user.token = token;
    user.tokenSecret = tokenSecret;
    user.profile = profile;
    initTwitterOauth();
    done(null, user);
  }
);
twitterAuthn.name = 'twitterAuthn';

twitterAuthz = new TwitterStrategy({
    consumerKey: config.consumerKey
  , consumerSecret: config.consumerSecret
  , callbackURL: "http://local.coolaj86.com:3000/authz/twitter/callback"
  , userAuthorizationURL: 'https://api.twitter.com/oauth/authorize'
  },
  function(token, tokenSecret, profile, done) {
    user.token = token;
    user.tokenSecret = tokenSecret;
    user.profile = profile;
    initTwitterOauth();
    done(null, user);
  }
);
twitterAuthz.name = 'twitterAuthz';

passport.use(twitterAuthn);
passport.use(twitterAuthz);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(express.session({ secret: "blahhnsnhoaeunshtoe" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/authn/twitter', passport.authenticate('twitterAuthn'));
app.get(
  '/authn/twitter/callback'
, passport.authenticate(
    'twitterAuthn'
  , { successRedirect: '/authnframe.html'
    , failureRedirect: '/nfailure'
    }
  )
);
app.get('/authz/twitter', passport.authenticate('twitterAuthz'));
app.get(
  '/authz/twitter/callback'
, passport.authenticate(
    'twitterAuthz'
  , { successRedirect: '/zsuccess'
    , failureRedirect: '/zfailure'
    }
  )
);
app.get('/twitter/tweet', function (req, res) {
  makeTweet(function (error, data) {
    if(error) {
      console.log(require('sys').inspect(error));
      res.end('bad stuff happened');
    } else {
      console.log(data);
      res.end('go check your tweets!');
    }
  });
});
app.get('/twitter/direct/:sn', function (req, res) {
  makeDm(req.params.sn, function (error, data) {
    if(error) {
      console.log(require('sys').inspect(error));
      res.end('bad stuff happened (dm)');
    } else {
      console.log(data);
      res.end("the message sent (but you can't see it!");
    }
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
