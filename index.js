require("dotenv").config();
require("events").EventEmitter.defaultMaxListeners = 50;
const {
  Discord,
  Client,
  Collection,
  StringSelectMenuBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  AttachmentBuilder,
} = require("discord.js");
const filters = require(`erela.js-filters`);
const { Manager, Queue } = require("erela.js");

const client = new Client({
  intents: 3276799,
});
////////////////////////////////Ready////////////////////////////////////////
client.on("ready", async () => {
  console.log(`[API] Logged in as ${client.user.username}`);
});

process.on("unhandledRejection", (error) => {
  console.log(error);
});
process.on("rejectionHandled", (error) => {
  console.log(error);
});
process.on("uncaughtException", (error) => {
  console.log(error);
});
module.exports = client;
client.commands = new Collection();
client.slashCommands = new Collection();
client.voiceGenerator = new Collection();
require("./handlers")(client);
const config = require("./config.json");
client.login(config.token).then(async () => {
  client.commands = new Collection();
  ["slashCommands"].forEach((x) => (client[x] = new Collection()));
  ["loadCommands"].forEach((x) =>
    require(`./handlers/${x}`)(client)
  );
  require(`./handlers/events.js`).init(client);
});
