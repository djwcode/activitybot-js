const { readdirSync } = require("fs");

module.exports = async (client) => {
  readdirSync("./SlashCommands/").map(async (dir) => {
    const commands = readdirSync(`./SlashCommands/${dir}/`).map(async (cmd) => {
      const pull = require(`../SlashCommands/${dir}/${cmd}`);
      client.slashCommands.set(pull.name, pull);
      if (pull.aliases) {
        pull.aliases.map((x) => client.slash.set(x, pull));
      }
    });
  });
  console.log("[" + "INFO" + "] " + "SlashCommand " + "Events" + " Loaded!");
};
