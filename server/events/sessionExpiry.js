const { deleteDemoUserData } = require("../controllers/user.controller");
const { demoUsernameForSession } = require("../controllers/auth.controller");

// connect-redis stores sessions under "sess:<sessionID>" by default
const SESSION_PREFIX = "sess:";

// Returns the session ID for an expired Redis key, or null if the key isn't a session.
const sessionIdFromKey = (key) =>
  typeof key === "string" && key.startsWith(SESSION_PREFIX)
    ? key.slice(SESSION_PREFIX.length)
    : null;

const handleExpiredKey = async (key, deleteFn = deleteDemoUserData) => {
  const sessionID = sessionIdFromKey(key);
  if (!sessionID) return false;
  // The session data is gone once the key expires, so we look up the demo
  // user by the username derived from the session ID. deleteDemoUserData
  // only touches users flagged is_demo, so regular accounts are never removed.
  return deleteFn(demoUsernameForSession(sessionID));
};

// Listens for Redis key expiry events and deletes the demo user (and their
// calendar entries) as soon as their session expires.
// `redis` is the ioredis client used by the session store.
const listenForSessionExpiry = (redis) => {
  // Keyspace notifications are off by default in Redis. docker-compose enables
  // them, but try here too in case the server points at another Redis.
  redis
    .config("SET", "notify-keyspace-events", "Ex")
    .catch((err) =>
      console.log(
        "Could not enable Redis keyspace notifications (demo sessions will only be cleaned up by logout and the nightly cron):",
        err.message
      )
    );

  const subscriber = redis.duplicate();
  subscriber.psubscribe("__keyevent@*__:expired").catch((err) => {
    console.error("Unable to subscribe to Redis expiry events", err);
  });
  subscriber.on("pmessage", async (_pattern, _channel, key) => {
    try {
      await handleExpiredKey(key);
    } catch (err) {
      console.error(`Failed to clean up expired session ${key}`, err);
    }
  });
  return subscriber;
};

module.exports = {
  listenForSessionExpiry,
  handleExpiredKey,
  sessionIdFromKey,
};
