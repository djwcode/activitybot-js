const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");

const globPromise = promisify(glob);

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const colors = require("colors");
const config = require("../config.json");

const { readdirSync } = require("fs");

/**
 * @param {Client} client
 */
module.exports = async (client) => {
  const arrayOfSlashCommands = [];
  readdirSync(`${process.cwd()}/SlashCommands`).forEach((value) => {
    const directory = value;
    const slashCommands = readdirSync(
      `${process.cwd()}/SlashCommands/${value}`
    );
    slashCommands
      .filter((file) => file.endsWith(".js"))
      .forEach((value) => {
        const file = require(`${process.cwd()}/SlashCommands/${directory}/${value}`);

        if (file.name) {
          let everything;
          everything = {
            name: file.name,
            description: file.description,
            options: file.options,
          };
          arrayOfSlashCommands.push(everything);
          client.slashCommands.set(file.name, file);
          client.commands.set(file.name, file);
        }
      });
  });

  client.on("ready", async () => {
    const rest = new REST({ version: "10" }).setToken(`${config.token}`);

    (async () => {
      try {
        await rest.put(Routes.applicationCommands(client.user.id), {
          body: arrayOfSlashCommands,
        });
        console.log("[ / Commands ]: Pushed".green.bold);
      } catch (error) {
        console.error(
          `[error catched while commands putting]: ${error} `.red.bold
        );
      }
    })();

    // Register for a single guild
    // await client.guilds.cache
    //     .get("888402668098310154")
    //     .commands.set(arrayOfSlashCommands);
    // await client.application?.commands.set(arrayOfSlashCommands).then(command => console.log(`${ command.name } `))

    // client.application.commands.fetch('888187567890120775')
    //   .then(command => console.log(`Fetched command ${ command.name } `))
    //   .catch(console.error);
    // Register for all the guilds the bot is in
    // await client.application.commands.set(arrayOfSlashCommands);
  });

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
      const cmd = client.slashCommands.get(interaction.commandName);
      const args = [];
      for (let option of interaction.options.data) {
        if (option.type === "SUB_COMMAND") {
          if (option.name) args.push(option.name);
          option.options?.forEach((x) => {
            if (x.value) args.push(x.value);
          });
        } else if (option.value) args.push(option.value);
      }
      interaction.member = interaction.guild.members.cache.get(
        interaction.user.id
      );

      return cmd.run(client, interaction);
    }

    if (interaction.isContextMenuCommand()) {
      await interaction.editReply({ ephemeral: false });
      const command = client.slashCommands.get(interaction.commandName);
      if (command) command.run(client, interaction);
    }
  });
};
