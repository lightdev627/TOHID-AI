let handler = async function (m, { conn, text, usedPrefix }) {
  let m2 = `≡ Use these commands without the prefix: *${usedPrefix}*
┌─⊷ *AUDIOS* 
▢ Bot
▢ Good morning
▢ Good afternoon
▢ Good evening
▢ Fine gentlemen
▢ Don't be Sad
└──────────────`;
  
              await conn.sendMessage(m.chat, {
            image: { url: userProfilePic },  
            caption: formattedInfo,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363207624903731@newsletter',
                    newsletterName: 'TOHID-AI BOT MENU💖',
                    serverMessageId: 143
                }
            }
        });

  // Send a button message
  await conn.sendButton(m.chat, m2, 'TOHID-AI', pp, [
    ['⏍ Info', `${usedPrefix}botinfo`],
    ['⌬ Group', `${usedPrefix}grp`]
  ], m, { quoted: m });

  // Send an image file
  await conn.sendFile(m.chat, pp, 'menu.jpg', m2, m);
}

handler.help = ['menu3'];
handler.tags = ['main'];
handler.command = ['menu3', 'audios'];

export default handler;
