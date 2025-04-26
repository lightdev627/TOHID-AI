import axios from "axios";
import ytSearch from "yt-search";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`❌ Please specify a video.\nUsage: ${usedPrefix}video <query>\nExample: ${usedPrefix}video never gonna give you up`);

  try {
    await m.reply("🔍 *Searching for video... Please wait...*");

    const search = await ytSearch(text);
    if (!search.videos.length) return m.reply("❌ No results found. Please refine your search.");
    
    const video = search.videos[0];
    const apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(video.url)}`;
    
    // Send video info first
    const infoMsg = `*╭┈❍ TOHID-AI VIDEO DOWNLOADER ❍┈┈╮*
│🎬 *Title:* ${video.title}
│⏳ *Duration:* ${video.timestamp || video.duration}
│👀 *Views:* ${video.views}
│👤 *Author:* ${video.author.name}
╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯
*Downloading... Please wait...*`;

    await conn.sendMessage(
      m.chat,
      { 
        image: { url: video.thumbnail },
        caption: infoMsg
      },
      { quoted: m }
    );

    // Fetch video data
    const { data } = await axios.get(apiUrl);
    if (!data.success || !data.result?.downloadUrl) {
      return m.reply("❌ Failed to fetch video. Trying alternative method...");
    }

    // Send video
    await conn.sendMessage(
      m.chat,
      {
        video: { url: data.result.downloadUrl },
        mimetype: "video/mp4",
        caption: `🎬 *${video.title}*\n\n✅ Download complete!`
      },
      { quoted: m }
    );

    // Send as document (optional)
    await conn.sendMessage(
      m.chat,
      {
        document: { url: data.result.downloadUrl },
        mimetype: "video/mp4",
        fileName: `${video.title.replace(/[^\w\s]/gi, '')}.mp4`,
        caption: "📁 Here's your video as a downloadable file"
      },
      { quoted: m }
    );

  } catch (error) {
    console.error(error);
    await m.reply(`❌ Error: ${error.message}`);
  }
};

handler.help = ["video <query>", "ytv <query>"];
handler.tags = ["downloader", "media"];
handler.command = /^(video|ytv|vid|mp4)$/i;

export default handler;
