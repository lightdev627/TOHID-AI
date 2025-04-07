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
  
  let pp = './assets/tohid.jpg';

  // Send message with newsletter context
  await conn.sendMessage(m.chat, {
    image: { url: pp },
    caption: m2,
    footer: 'TOHID-AI',
    buttons: [
      { buttonId: `${usedPrefix}botinfo`, buttonText: { displayText: '⏍ Info' }, type: 1 },
      { buttonId: `${usedPrefix}grp`, buttonText: { displayText: '⌬ Group' }, type: 1 }
    ],
    contextInfo: {
      mentionedJid: [m.sender],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363207624903731@newsletter',
        newsletterName: 'TOHID-AI Audio Commands',
        newsletterThumbnail: pp,
        serverMessageId: 999
      },
      externalAdReply: {
        title: 'TOHID-AI Audio Menu',
        body: 'Click to explore audio commands!',
        thumbnail: await (await fetch(pp)).buffer(),
        mediaType: 1,
        mediaUrl: '',
        sourceUrl: 'https://wa.me/917849917350' + (conn.user.jid.split`@`[0]),
        showAdAttribution: true
      }
    }
  }, { quoted: m });

  // Alternative simple file send
  await conn.sendFile(m.chat, pp, 'menu.jpg', m2, m);
}

handler.help = ['menu3'];
handler.tags = ['main'];
handler.command = ['menu3', 'audios'];

export default handler;
