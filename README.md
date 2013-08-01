node-twitter-demo
===

**Tutorial & Screencast**:
[How to Tweet from NodeJS](http://blog.coolaj86.com/articles/how-to-tweet-from-nodejs/)

A demo that shows Authn, Authz, Tweeting, and Direct Messages with twitter.

Upfront: If you're looking into any of the following libraries
you're just wasting your time.
They're mostly outdated and or unnecessary.

  * node-twitter-api
  * twitter-api
  * node-twitter
  * twitter

Instead you'll want to look at `node-oauth` and how it's used in this example.

Not to say that those other libraries aren't valuable,
but just get it working with OAuth first and then go
back and figure out which one you want to try to fork
and bring up to date (or add features to).

## Install this Demo

    git clone git@github.com:coolaj86/node-twitter-demo.git
    pushd node-twitter-demo
    npm install

## Sign up with twitter

You'll need to edit your `/etc/hosts` file so that
`local.example.com 127.0.0.1` exists
(you can't use `localhost` for a twitter app's domain).

Sign up for a twitter developer account and then
go to <https://dev.twitter.com/apps> and create an app.

Under the **Settings Tab** make sure that you have permissions for

  * **Read, Write and Access direct messages**
  * **Allow this application to be used to Sign in with Twitter**

## Use

Change `config.json` to use your app's **Consumer Key & Secret**
(which is on the **Details** tab).

Now run the app

    node app

Visit <http://local.example.com:3000> and play around.

Note that you'll have to *authorize* before you can use the Direct Message
feature, no matter how many times you *authenticate*.

You can use the tweet functionality, however, just by authenticating.

## Marvel

All of the magic happens in `app.js` and a tiny bit in `views/index.jade`.
I don't think you need to look at anything else.
