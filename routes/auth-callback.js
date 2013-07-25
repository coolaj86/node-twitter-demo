
/*
 * GET auth window.
 */

exports.index = function(req, res){
  console.log('auth-callback,user', req.user);
  res.render('auth-callback', { user: JSON.stringify(req.user) });
};
