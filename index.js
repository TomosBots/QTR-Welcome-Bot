
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
const MEMBER_COUNT_CHANNEL_ID =
  process.env.MEMBER_COUNT_CHANNEL_ID || "";
const LOGO_URL = process.env.LOGO_URL || "";
const WELCOME_IMAGE_URL =
  process.env.WELCOME_IMAGE_URL || "";

const QTR_MAROON = 0x8A1538;
const QTR_GOLD = 0xD4AF37;

// Update the voice channel to show the current member count.
async function updateMemberCounter(guild) {
  if (!MEMBER_COUNT_CHANNEL_ID) return;

  try {
    const channel = await guild.channels.fetch(
      MEMBER_COUNT_CHANNEL_ID
    );

    if (!channel || !channel.isVoiceBased()) {
      console.error(
        "Member counter channel not found or is not a voice channel."
      );
      return;
    }

    const count = guild.memberCount;
    const newName = `👥・Members: ${count}`;

    if (channel.name !== newName) {
      await channel.setName(newName);
      console.log(`Member counter updated: ${count}`);
    }
  } catch (err) {
    console.error("Member counter update failed:", err);
  }
}

client.once("ready", async () => {
  console.log(
    `🇶🇦 QTR Welcome Bot is online as ${client.user.tag}`
  );

  // Synchronise counters after a restart or deployment.
  for (const guild of client.guilds.cache.values()) {
    await updateMemberCounter(guild);
  }
});

client.on("guildMemberAdd", async (member) => {
  // Refresh the counter when someone joins.
  await updateMemberCounter(member.guild);

  const memberCount = member.guild.memberCount;

  const welcomeEmbed = new EmbedBuilder()
    .setColor(QTR_MAROON)
    .setTitle("🇶🇦  WELCOME TO QTR")
    .setDescription(
      `Welcome to the family, ${member}! 👑\n\n` +
      "We're delighted to have you join **QTR • SUNDAY CITY**!\n" +
      "You've joined a community built on friendship, amazing parties " +
      "and unforgettable memories. ❤️\n\n" +
      "━━━━━━━━━━━━━━━━━━━━\n\n" +
      `👥 **QTR FAMILY MEMBERS: ${memberCount}**\n\n` +
      "━━━━━━━━━━━━━━━━━━━━\n\n" +
      "👑 **YOUR FIRST STEPS**\n\n" +
      "📜 **Read the Rules**\n" +
      "Get to know our community: <#1558637380926177380>\n\n" +
      "💬 **Meet the Family**\n" +
      "Introduce yourself: <#1558635229634105384>\n\n" +
      "🎉 **Stay Connected**\n" +
      "Keep an eye out for updates and upcoming QTR events!\n\n" +
      "━━━━━━━━━━━━━━━━━━━━\n\n" +
      "**ONE FAMILY. ONE COMMUNITY. QTR.** ❤️"
    )
    .setFooter({
      text: "QTR • QATAR • WELCOME TO THE FAMILY"
    })
    .setTimestamp();

  const memberAvatar = member.displayAvatarURL({
  size: 256,
  extension: "png"
});

welcomeEmbed.setThumbnail(memberAvatar);
  if (WELCOME_IMAGE_URL) {
    welcomeEmbed.setImage(WELCOME_IMAGE_URL);
  }

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

  // Private welcome DM.
  const dmEmbed = new EmbedBuilder()
    .setColor(QTR_GOLD)
    .setTitle("🇶🇦  WELCOME TO THE QTR FAMILY")
    .setDescription(
      `Hey **${member.user.username}**! 👋\n\n` +
      `Thank you for joining **${member.guild.name}**. 👑\n\n` +
      `👥 **You're now part of a family of ${memberCount} members!**\n\n` +
      "━━━━━━━━━━━━━━━━━━━━\n\n" +
      "📜 **STEP 1 — KNOW THE RULES**\n" +
      "Read the server rules before getting involved.\n\n" +
      "💬 **STEP 2 — SAY HELLO**\n" +
      "Head to General Chat and introduce yourself to the family.\n\n" +
      "🎉 **STEP 3 — ENJOY QTR**\n" +
      "Make friends and look forward to our events!\n\n" +
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

client.on("guildMemberRemove", async (member) => {
  // Refresh the counter when someone leaves.
  await updateMemberCounter(member.guild);
});

if (!TOKEN) {
  throw new Error("Missing DISCORD_TOKEN environment variable.");
}

if (!WELCOME_CHANNEL_ID) {
  throw new Error(
    "Missing WELCOME_CHANNEL_ID environment variable."
  );
}

client.login(TOKEN);
