const { deleteDemoUserData } = require("../controllers/user.controller");
const { demoUsernameForSession } = require("../controllers/auth.controller");

// Sessions last a hard SESSION_MAX_AGE_MS (30 min) from login (set via req.session.expiresAt in
// the auth controller). express-session normally pushes the expiry forward on
// every request ("touch"), which kept the Redis session alive while the
// browser cookie had already expired. Pinning cookie.expires to expiresAt keeps
// the cookie, the Redis TTL, and the session in sync.
const enforceSessionExpiry = (req, res, next) => {
  const session = req.session;
  if (!session || !session.isAuth) return next();

  if (!session.expiresAt) {
    // Session created before this change: start the clock from its current expiry.
    session.expiresAt = session.cookie.expires
      ? new Date(session.cookie.expires).getTime()
      : Date.now() + session.cookie.originalMaxAge;
  }

  if (Date.now() < session.expiresAt) {
    session.cookie.expires = new Date(session.expiresAt);
    return next();
  }

  // Expired: clean up demo data and replace with a fresh, unauthenticated session.
  const isDemo = session.isDemo;
  const demoUsername = demoUsernameForSession(req.sessionID);
  session.regenerate(async (err) => {
    if (err) return next(err);
    if (isDemo) {
      try {
        await deleteDemoUserData(demoUsername);
      } catch (e) {
        console.error("Failed to delete expired demo user", e);
      }
    }
    next();
  });
};

module.exports = enforceSessionExpiry;
