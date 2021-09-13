const cron = require("node-cron");
const { deleteDemoUsers } = require("../controllers/user.controller");
console.log("running cron file");
// Schedule tasks to be run on the server.

module.exports = () => {
  cron.schedule("* * * * *", async () => {
    console.log("Deleting demo users");
    await deleteDemoUsers();
    console.log("Finished deleting demo users");
  });
};
