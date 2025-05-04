let handler = async (m, { conn, text }) => {
  let who = m.isGroup ? m.mentionedJid[0] : m.chat
  if (!who) throw '✳️ Please tag the user to add Gold.'

  let txt = text.replace('@' + who.split('@')[0], '').trim()
  if (!txt) throw '✳️ Enter the amount of *Gold* to add.'
  if (isNaN(txt)) throw '🔢 Numbers only, please.'

  let amount = parseInt(txt)
  if (amount < 1) throw '✳️ Minimum amount is *1* Gold.'

  let users = global.db.data.users
  users[who].credit += amount

  await m.reply(
    `🎖️ *Gold Added Successfully*\n\n▢ *User:* @${who.split('@')[0]}\n▢ *Amount:* +${amount} Gold`,
    null,
    {
      mentions: [who],
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363207624903731@newsletter',
          serverMessageId: '',
          newsletterName: '𝐓𝐎𝐇𝐈𝐃 𝐓𝐄𝐂𝐇 🤖'
        }
      }
    }
  )

  await conn.sendMessage(
    m.chat,
    {
      text: `🪙 *You have received +${amount} Gold!*`,
      mentions: [who],
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363207624903731@newsletter',
          serverMessageId: '',
          newsletterName: '𝐓𝐎𝐇𝐈𝐃 𝐓𝐄𝐂𝐇 🤖'
        }
      }
    },
    { quoted: m }
  )
}

handler.help = ['addgold <@user> <amount>']
handler.tags = ['economy']
handler.command = ['addgold']
handler.rowner = true

export default handler
