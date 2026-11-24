// Rejects requests without an authenticated session so the client can
// log the user out (e.g. after their session cookie expires).
const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.isAuth) {
    return res
      .status(401)
      .json({ success: false, message: "Session expired or not logged in" });
  }
  next();
};

module.exports = requireAuth;
