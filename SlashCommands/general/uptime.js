const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const pretty = require("pretty-ms");
const os = require("os");

module.exports = {
  name: "uptime",
  description: "Узнать пинг бота",
  run: async (client, interaction, args) => {
    const cpu = os.cpus()[0].model;
    const cores = os.cpus().length;
    const ram = os.totalmem() / 1000 / 1000 - 1000;
    const pinged = new EmbedBuilder()
      .addFields(
        {
          name: "**Задержка API**",
          value: `🟢 | ${client.ws.ping}ms`,
        },
        {
          name: "**Задержка сообщении**",
          value: `🔴 | ${Date.now() - interaction.createdTimestamp}ms`,
        },
        {
          name: "**Аптайм**",
          value: `⏲️ | ${pretty(client.uptime)}`,
        }
      )
      .setColor("#4453F5")
      .setTitle("**:ping_pong: | Пинг Понг!**")
      .setDescription(`Процессор: ${cpu} Ядер: ${cores} Озу: ${ram} ГБ`)
      .setFooter({
        text: `Запросил: ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });
    const pinging = new EmbedBuilder()
      .setDescription("🚨 Загружается...")
      .setColor("#4453F5");
    interaction.reply({ embeds: [pinging] }).then(() =>
      setTimeout(() => {
        interaction.editReply({ embeds: [pinged] });
      }, 2 * 1000)
    );
  },
};
