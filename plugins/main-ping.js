import { exec } from 'child_process'
import speed from 'performance-now'
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  // Newsletter configuration
  const newsletterInfo = {
    newsletterJid: '120363207624903731@newsletter',
    newsletterName: 'TOHID-AI Performance Updates',
    newsletterThumbnail: 'https://i.imgur.com/WnKjrJt.jpeg'
  }

  let thumbnail = newsletterInfo.newsletterThumbnail
  let fgg = {
    key: { 
      fromMe: false, 
      participant: `0@s.whatsapp.net`, 
      remoteJid: 'status@broadcast' 
    },
    message: {
      contactMessage: {
        displayName: `TOHID-AI Performance`,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;TOHID-AI;;;\nFN:'TOHID-AI Performance Bot'\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Performance\nEND:VCARD`,
      },
    },
  }

  // Send initial ping message with newsletter context
  let pingMsg = await conn.sendMessage(m.chat, { 
    text: '⚡ Measuring TOHID-AI performance...', 
    contextInfo: {
      forwardedNewsletterMessageInfo: {
        newsletterJid: newsletterInfo.newsletterJid,
        newsletterName: newsletterInfo.newsletterName,
        newsletterThumbnail: newsletterInfo.newsletterThumbnail,
        serverMessageId: 999
      },
      externalAdReply: {
        title: 'TOHID-AI Performance Test',
        body: 'Checking server response times',
        thumbnail: await (await fetch(thumbnail)).buffer(),
        mediaType: 1,
        sourceUrl: 'https://wa.me/' + (conn.user.jid.split`@`[0])
      }
    }
  }, { quoted: fgg })

  let timestamp = speed()

  await exec('neofetch --stdout', async (error, stdout) => {
    let latency = (speed() - timestamp).toFixed(4)
    let perfData = stdout || 'No system info available'
    
    // Send performance results with newsletter context
    await conn.relayMessage(
      m.chat,
      {
        protocolMessage: {
          key: pingMsg.key,
          type: 14,
          editedMessage: {
            conversation: `*TOHID-AI PERFORMANCE REPORT*\n\n` +
                         `⏱️ *Response Time:* ${latency} ms\n` +
                         `📊 *System Info:* ${perfData.substring(0, 200)}...\n\n` +
                         `_Subscribe to our newsletter for regular performance updates_`,
          },
        },
        contextInfo: {
          forwardedNewsletterMessageInfo: newsletterInfo,
          mentionedJid: [m.sender]
        }
      },
      {}
    )
    
    // Additional system info file if needed
    await conn.sendMessage(m.chat, {
      document: { url: thumbnail },
      mimetype: 'application/json',
      fileName: 'system_info.txt',
      caption: 'Full system performance data',
      contextInfo: {
        forwardedNewsletterMessageInfo: newsletterInfo
      }
    }, { quoted: m })
  })
}

handler.help = ['ping']
handler.tags = ['main']
handler.command = ['ping', 'speed']

export default handler
