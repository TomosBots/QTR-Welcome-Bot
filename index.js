
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

const TOKEN = process.env.DISCORD_TOKEN;
const WELCOME_CHANNEL_ID = process.env.WELCOME_CHANNEL_ID;
const LOGO_URL = process.env.LOGO_URL || "";

client.once("ready", () => {
  console.log(`QTR Welcome Bot is online as ${client.user.tag}`);
});

client.on("guildMemberAdd", async (member) => {
  const welcomeEmbed = new EmbedBuilder()
    .setColor(0x8A1538)
    .setTitle("🇶🇦 Welcome to QTR!")
    .setDescription(
      `Welcome ${member}!\n\n` +
      "We're delighted to have you join the QTR family. " +
      "Get to know our amazing members and look out for our events!\n\n" +
      "👑 **Your first steps**\n" +
      "• Read the server rules\n" +
      "• Meet the community\n" +
      "• Check out the event channels\n\n" +
      "*One family. One community. QTR.*"
    )
    .setThumbnail(
      LOGO_URL || member.guild.iconURL({ size: 256 })
    )
    .setFooter({ text: "QTR • Qatar • Welcome to the family" })
    .setTimestamp();

  const channel = await member.guild.channels
    .fetch(WELCOME_CHANNEL_ID)
    .catch(() => null);

  if (channel && channel.isTextBased()) {
    await channel.send({ embeds: [welcomeEmbed] })
      .catch(err => console.error("Channel welcome failed:", err));
  } else {
    console.error("Welcome channel not found. Check its ID.");
  }

  const dmEmbed = new EmbedBuilder()
    .setColor(0xD4AF37)
    .setTitle("🇶🇦 Welcome to QTR!")
    .setDescription(
      `Hey ${member.user.username}!\n\n` +
      `Thanks for joining **${member.guild.name}**! 👑\n\n` +
      "We're happy to have you with us. Please read the rules, " +
      "say hello, and keep an eye on our event channels.\n\n" +
      "We hope you enjoy being part of the QTR family! ❤️"
    )
    .setFooter({ text: "QTR • Qatar • Welcome to the family" });

  if (LOGO_URL) dmEmbed.setThumbnail(LOGO_URL);

  await member.send({ embeds: [dmEmbed] })
    .catch(() => console.log(
      `Could not DM ${member.user.tag}; their DMs may be closed.`
    ));
});

if (!TOKEN) {
  throw new Error("Missing DISCORD_TOKEN environment variable.");
}

client.login(TOKEN);

