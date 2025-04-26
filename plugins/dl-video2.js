import axios from "axios";
import ytSearch from "yt-search";

let handler = async (m, { conn, text, botname, usedPrefix, command }) => {
  if (!text) return m.reply(`❌ Please specify a video. Usage: ${usedPrefix}video <query>`);

  // Sub-commands handler
  const args = text.split(' ');
  const subCommand = args[0].toLowerCase();

  if (['play', 'download', 'search'].includes(subCommand)) {
    await handleVideoPlay(m, conn, args.slice(1).join(' '), botname);
  } else if (subCommand === 'info') {
    await handleVideoInfo(m, conn, args.slice(1).join(' '));
  } else if (subCommand === 'help') {
    await showHelp(m, conn, usedPrefix);
  } else {
    // Default action is play if no subcommand
    await handleVideoPlay(m, conn, text, botname);
  }
};

async function handleVideoPlay(m, conn, query, botname) {
  await m.reply("🔄 *Tohid-Ai bot is fetching your video... Please wait...*");

  try {
    let search = await ytSearch(query);
    let video = search.videos[0];

    if (!video) return m.reply("❌ No results found. Please refine your search.");

    let link = video.url;
    let apis = [
      `https://apis.davidcyriltech.my.id/youtube/mp4?url=${link}`,
      `https://api.ryzendesu.vip/api/downloader/ytmp4?url=${link}`
    ];

    for (const api of apis) {
      try {
        let { data } = await axios.get(api);

        if (data.status === 200 || data.success) {
          let videoUrl = data.result?.downloadUrl || data.url;
          let videoData = {
            title: data.result?.title || video.title,
            artist: data.result?.author || video.author.name,
            thumbnail: data.result?.image || video.thumbnail,
            duration: video.duration.toString(),
            views: video.views,
            url: link
          };

          // Send metadata & thumbnail
          await conn.sendMessage(
            m.chat,
            {
              image: { url: videoData.thumbnail },
              caption: `THE TOHID-AI VIDEO SYSTEM
╭═════════════════⊷
║ 🎬 *Title:* ${videoData.title}
║ 🎤 *Channel:* ${videoData.artist}
║ ⏱️ *Duration:* ${videoData.duration}
║ 👀 *Views:* ${videoData.views}
║ 🔗 *URL:* ${videoData.url}
╰═════════════════⊷
*© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚃𝙾𝙷𝙸𝙳-𝙰𝙸*`
            },
            { quoted: m }
          );

          await m.reply("📤 *Sending your video...*");

          // Send as a video file
          await conn.sendMessage(
            m.chat,
            {
              video: { url: videoUrl },
              mimetype: "video/mp4",
              caption: `Here's your video: ${videoData.title}`
            },
            { quoted: m }
          );

          await m.reply("📤 *Sending as downloadable file...*");

          // Send as a document file
          await conn.sendMessage(
            m.chat,
            {
              document: { url: videoUrl },
              mimetype: "video/mp4",
              fileName: `${videoData.title.replace(/[^a-zA-Z0-9 ]/g, "")}.mp4`,
            },
            { quoted: m }
          );

          await m.reply("✅ *Tohid-Ai – Video successfully sent! Enjoy! 🎬*");
          return;
        }
      } catch (e) {
        console.error(`API Error (${api}):`, e.message);
        continue;
      }
    }

    return m.reply("⚠️ An error occurred. All video APIs might be down or unable to process the request.");
  } catch (error) {
    return m.reply("❌ Video download failed\n" + error.message);
  }
}

async function handleVideoInfo(m, conn, query) {
  try {
    let search = await ytSearch(query);
    let video = search.videos[0];

    if (!video) return m.reply("❌ No video found with that query.");

    await conn.sendMessage(
      m.chat,
      {
        image: { url: video.thumbnail },
        caption: `📹 VIDEO INFORMATION
╭═════════════════⊷
║ 🎬 *Title:* ${video.title}
║ 🎤 *Channel:* ${video.author.name}
║ ⏱️ *Duration:* ${video.duration.toString()}
║ 📅 *Uploaded:* ${video.ago}
║ 👀 *Views:* ${video.views}
║ 🔗 *URL:* ${video.url}
╰═════════════════⊷
Use ${usedPrefix}video play ${video.title} to download`
      },
      { quoted: m }
    );
  } catch (error) {
    return m.reply("❌ Failed to fetch video information\n" + error.message);
  }
}

async function showHelp(m, conn, usedPrefix) {
  const helpText = `🎬 TOHID-AI VIDEO COMMAND HELP
╭═════════════════⊷
║ ${usedPrefix}video <query> - Download video
║ ${usedPrefix}video play <query> - Play/download video
║ ${usedPrefix}video info <query> - Show video info
║ ${usedPrefix}video help - Show this help
╰═════════════════⊷
Examples:
${usedPrefix}video never gonna give you up
${usedPrefix}video info baby shark
${usedPrefix}video play despacito`;

  await m.reply(helpText);
}

handler.help = ["video [query]", "video play [query]", "video info [query]"];
handler.tags = ["downloader", "video"];
handler.command = /^video2$/i;

export default handler;