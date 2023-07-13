const fs = require("fs");

module.exports.init = async (client) => {
  fs.readdirSync("./events/").forEach((dir) => {
    const commands = fs
      .readdirSync(`./events/${dir}`)
      .filter((file) => file.endsWith(".js"));
    for (let file of commands) {
      let pull = require(`../events/${dir}/${file}`);
      if (pull.once) {
        client.once(pull.name, (...args) => pull.run(client, ...args));
      } else {
        client.on(pull.name, (...args) => pull.execute(client, ...args));
      }
    }
  });
};
