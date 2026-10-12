
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
const WELCOME_IMAGE_URL =
  process.env.WELCOME_IMAGE_URL || "";

const QTR_MAROON = 0x8A1538;
const QTR_GOLD = 0xD4AF37;

client.once("ready", () => {
  console.log(
    `🇶🇦 QTR Welcome Bot is online as ${client.user.tag}`
  );
});

client.on("guildMemberAdd", async (member) => {
  // PUBLIC WELCOME EMBED
  const welcomeEmbed = new EmbedBuilder()
    .setColor(QTR_MAROON)
    .setTitle("🇶🇦  WELCOME TO QTR")
    .setDescription(
      `Welcome to the family, ${member}! 👑\n\n` +
      "We're delighted to have you join **QTR • SUNDAY CITY**!\n" +
      "You've joined a community built on friendship, amazing parties " +
      "and unforgettable memories. ❤️\n\n" +
      "━━━━━━━━━━━━━━━━━━━━\n\n" +
      "👑 **YOUR FIRST STEPS**\n\n" +
      `📜 **Read the Rules**\n` +
      `Get to know our community: <#1558637380926177380>\n\n` +
      `💬 **Meet the Family**\n` +
      `Introduce yourself and say hello: <#1558635229634105384>\n\n` +
      "🎉 **Stay Connected**\n" +
      "Keep an eye out for updates and upcoming QTR events!\n\n" +
      "━━━━━━━━━━━━━━━━━━━━\n\n" +
      "**ONE FAMILY. ONE COMMUNITY. QTR.** ❤️"
    )
    .setFooter({
      text: "QTR • QATAR • WELCOME TO THE FAMILY"
    })
    .setTimestamp();

  const guildIcon = member.guild.iconURL({
    size: 256,
    extension: "png"
  });

  if (LOGO_URL || guildIcon) {
    welcomeEmbed.setThumbnail(LOGO_URL || guildIcon);
  }

  if (WELCOME_IMAGE_URL) {
    welcomeEmbed.setImage(WELCOME_IMAGE_URL);
  }

  // SEND PUBLIC WELCOME
  const channel = await member.guild.channels
    .fetch(WELCOME_CHANNEL_ID)
    .catch(() => null);

  if (channel && channel.isTextBased()) {
    await channel.send({
      content: `🇶🇦 Please give ${member} a warm welcome! 👑`,
      embeds: [welcomeEmbed]
    }).catch((err) => {
      console.error("Channel welcome failed:", err);
    });
  } else {
    console.error(
      "Welcome channel not found. Check WELCOME_CHANNEL_ID."
    );
  }

  // PRIVATE WELCOME DM
  const dmEmbed = new EmbedBuilder()
    .setColor(QTR_GOLD)
    .setTitle("🇶🇦  WELCOME TO THE QTR FAMILY")
    .setDescription(
      `Hey **${member.user.username}**! 👋\n\n` +
      `Thank you for joining **${member.guild.name}**. 👑\n\n` +
      "We're so happy to have you with us!\n\n" +
      "━━━━━━━━━━━━━━━━━━━━\n\n" +
      "📜 **STEP 1 — KNOW THE RULES**\n" +
      "Please read the server rules before getting involved.\n\n" +
      "💬 **STEP 2 — SAY HELLO**\n" +
      "Head to General Chat and introduce yourself to the family.\n\n" +
      "🎉 **STEP 3 — ENJOY QTR**\n" +
      "Get involved, make friends and look forward to our events!\n\n" +
      "━━━━━━━━━━━━━━━━━━━━\n\n" +
      "❤️ We're glad you're here. Welcome to the family!"
    )
    .setFooter({
      text: "QTR • QATAR • ONE FAMILY"
    })
    .setTimestamp();

  if (LOGO_URL) {
    dmEmbed.setThumbnail(LOGO_URL);
  }

  await member.send({
    embeds: [dmEmbed]
  }).catch(() => {
    console.log(
      `Could not DM ${member.user.tag}; their DMs may be closed.`
    );
  });
});

if (!TOKEN) {
  throw new Error(
    "Missing DISCORD_TOKEN environment variable."
  );
}

if (!WELCOME_CHANNEL_ID) {
  throw new Error(
    "Missing WELCOME_CHANNEL_ID environment variable."
  );
}

client.login(TOKEN);
