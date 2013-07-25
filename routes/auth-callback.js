
/*
 * GET auth window.
 */

exports.index = function(req, res){
  res.render('auth-callback', { user: JSON.stringify(req.user) });
};
