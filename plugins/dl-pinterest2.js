import pkg from 'api-qasim';
const { Pinterest2 } = pkg;

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!args[0]) throw `✳️ Enter A Query\n\n📌${mssg.example} : ${usedPrefix + command} nature`;

    try {
        await m.react('⏳');
        // Fetch Pinterest results based on the query
        let res = await Pinterest2(args[0]);
        console.log(res); // Log the result for debugging

        // Check if the result contains images
        if (!res.result || res.result.length === 0) {
            return m.reply("✳️ No images found for your search query.");
        }

        // Extract the first 5 image URLs
        const imageUrls = res.result.slice(0, 5).map(item => item.images_url);

        // If there are images, send them
        let message = `Found images for query *${args[0]}*:\n\n`;
        await m.react('✅');

        for (let i = 0; i < imageUrls.length; i++) {
            // Send each image as a message
            await conn.sendMessage(m.chat, { image: { url: imageUrls[i] }, caption: `${message}Image ${i + 1}` }, { quoted: m });
        }
    } catch (error) {
        m.reply(`✳️ ${mssg.error}: ${error.message || error}`);
    }
}

handler.help = ['pinterest2', 'pinimg'];
handler.tags = ['search'];
handler.command = ['pinterest2', 'pinimg'];

export default handler;
