import axios from 'axios';

const handler = async (m, { conn, args }) => {
  try {
    const query = args[0];
    if (!query) return m.reply('❓ *Example:* .ytmp4 <YouTube URL>');

    // Notify user that the video is being fetched
    await m.reply('🔍 *Fetching video details...*');

    // Encode the YouTube URL
    const encodedUrl = encodeURIComponent(query);
    
    // New API URL with apikey parameter
    const apiUrl = `https://api.giftedtech.my.id/api/download/dlmp4?apikey=gifted&url=${encodedUrl}`;
    const response = await axios.get(apiUrl);

    // Check if response data contains downloadUrl (note the different response structure)
    if (!response.data?.status || !response.data?.result?.downloadUrl) {
      return m.reply('🚫 *Error fetching video.* Please check the URL or try again later.');
    }

    // Extract video details from the new API response structure
    const { title, quality, thumbnail, downloadUrl, size } = response.data.result;

    // Prepare the caption for the video message
    const caption = `🎥 *Title:* ${title}
📊 *Quality:* ${quality}
📦 *Size:* ${size}
🖼️ *Thumbnail:* ${thumbnail}
Tohid-Ai Bot 2025
📥 *Download the video:* ${downloadUrl}`;

    // Send the video and the caption
    await conn.sendMessage(m.chat, {
      video: { url: downloadUrl },
      caption: caption,
      thumbnail: { url: thumbnail },
    }, { quoted: m });

    // Notify user of successful completion
    await m.reply('✅ *Tohid-Ai Bot Video sent successfully!*');

  } catch (error) {
    console.error('Error in ytmp4 command:', error.message);
    m.reply('⚠️ *An error occurred while processing your request.* Please try again later.');
  }
};

handler.help = ['ytmp4'];
handler.tags = ['download'];
handler.command = /^ytmp4$/i;

export default handler;