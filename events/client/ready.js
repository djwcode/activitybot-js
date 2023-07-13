const { EmbedBuilder, ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: false,
  async execute(client) {
    client.on("presenceUpdate", async (oldPresence, newPresence) => {
      const activity = await newPresence.member.presence?.activities.find(activity => activity.type === ActivityType.Custom)
      const guild = await client.guilds.fetch(`1128806394024439970`) // Айди сервера
      const user = await guild.members.fetch(newPresence.member.id || oldPresence.member.id).catch(() => null)
      if (user && activity?.state === `https://discord.gg/gAr2n5hd` || user && activity?.state === `https://discord.gg/RytDFe6m`) return user.roles.add(`1128806740717211668`, `Right status :)`) // айди роли
      if (user && activity?.state === undefined) return user.roles.remove(`1128806740717211668`, `Wrong status :(`) // айди роли
      if (user && activity?.state !== `https://discord.gg/gAr2n5hd`) return user.roles.remove(`1128806740717211668`, `Wrong status :(`) // айди роли
      await console.log(newPresence.member.id)
      return console.log(activity?.state)
    })
  }
};