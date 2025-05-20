import fetchJson from "fetch-json"; // Make sure to install this package
import ytSearch from "yt-search";

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("❌ What song do you want to download?");

  await m.reply("🔄 *Tohid-Ai bot is fetching your audio... Please wait...*");

  try {
    let search = await ytSearch(text);
    let video = search.videos[0];

    if (!video) return m.reply("❌ No results found. Please refine your search.");

    let q = video.url;
    
    try {
      const data = await fetchJson(`https://vajiraapi-5ea329b6f243.herokuapp.com/download/ytmp3?url=${q}`);
      
      if (!data.result || !data.result.d_link) {
        throw new Error("Invalid API response");
      }

      let songData = {
        title: data.result.title || video.title,
        artist: video.author.name,
        thumbnail: video.thumbnail,
        audioUrl: data.result.d_link
      };

      // Send metadata & thumbnail
      await conn.sendMessage(
        m.chat,
        {
          image: { url: songData.thumbnail },
          caption: `THE TOHID-AI BOT
╭═════════════════⊷
║ 🎶 *Title:* ${songData.title}
║ 🎤 *Artist:* ${songData.artist}
║ 🔗 THANK YOU SORRY NO URL TO BE SHARED
╰═════════════════⊷
*© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚃𝙾𝙷𝙸𝙳-𝙰𝙸*`
        },
        { quoted: m }
      );

      await m.reply("📤 *Sending your audio...*");

      // Send as an audio file
      await conn.sendMessage(
        m.chat,
        {
          audio: { url: songData.audioUrl },
          mimetype: "audio/mp4",
        },
        { quoted: m }
      );

      await m.reply("📤 *Sending your MP3 file...*");

      // Send as a document file
      await conn.sendMessage(
        m.chat,
        {
          document: { url: songData.audioUrl },
          mimetype: "audio/mp3",
          fileName: `${songData.title.replace(/[^a-zA-Z0-9 ]/g, "")}.mp3`,
        },
        { quoted: m }
      );

      await m.reply("✅ *Tohid-Ai – World-class bot just successfully sent you what you requested! 🎶*");

    } catch (error) {
      console.error("API Error:", error.message);
      return m.reply("⚠️ Failed to download audio. Please try again later.");
    }

  } catch (error) {
    console.error("Error:", error.message);
    return m.reply("❌ Download failed\n" + error.message);
  }
};

handler.help = ["play"];
handler.tags = ["downloader"];
handler.command = /^play$/i;

export default handler;