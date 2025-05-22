const yts = require("yt-search");
const fetch = require("node-fetch");

let handler = async (m, { conn, text, botname }) => {
  if (!text) return m.reply("⚠️ *Please provide the name/link of the video you want to download.*");

  let loadingMsg = await m.reply("⏳ *Tohid-Ai Searching for your video... Please wait...*");

  try {
    let search = await yts(text);
    let video = search.videos[0];

    if (!video) return m.reply("❌ *No results found for your query.*");

    // Using the new API
    let encodedUrl = encodeURIComponent(video.url);
    let apiUrl = `https://api.giftedtech.my.id/api/download/ytvideo?apikey=gifted&url=${encodedUrl}`;
    let response = await fetch(apiUrl);
    let data = await response.json();

    if (!data.status || !data.result) return m.reply("🚫 *Failed to fetch video. Please try again later.*");

    const { title, downloadUrl, quality, size } = data.result;

    await conn.sendMessage(m.chat, { delete: loadingMsg.key });

    let caption = `🎬 *Title:* ${title}\n🔹 *Quality:* ${quality}\n📦 *Size:* ${size}\n\n✅ *Powered by ${botname}*`;

    await conn.sendMessage(m.chat, {
      image: { url: video.thumbnail },
      caption: caption,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363207624903731@newsletter',
          newsletterName: '𝐓𝐎𝐇𝐈𝐃 𝐓𝐄𝐂𝐇 🤖',
          serverMessageId: 143
        }
      }
    });

    await conn.sendMessage(m.chat, {
      video: { url: downloadUrl },
      mimetype: "video/mp4",
      caption: `🎥 Here is your video: *${title}*`,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363207624903731@newsletter',
          newsletterName: '𝐓𝐎𝐇𝐈𝐃 𝐓𝐄𝐂𝐇 🤖',
          serverMessageId: 143
        }
      }
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
    m.reply("❌ *Something went wrong! Please try again later.*");
  }
};

handler.help = ["video", "mp4"];
handler.tags = ["downloader"];
handler.command = ["video", "mp4"];

export default handler;