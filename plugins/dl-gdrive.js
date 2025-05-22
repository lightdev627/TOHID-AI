import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `✳️ Enter a Google Drive link`
  m.react(rwait)
  
  try {
    // Encode the Google Drive URL
    const encodedUrl = encodeURIComponent(args[0])
    const apiUrl = `https://api.giftedtech.my.id/api/download/gdrivedl?apikey=gifted&url=${encodedUrl}`
    
    // Fetch from the API
    const response = await fetch(apiUrl)
    const res = await response.json()
    
    if (!res.status) throw new Error(res.message || 'Failed to download file')
    
    await m.reply(`
≡ *Tohid-Ai Google Drive DL*

▢ *Name:* ${res.result.fileName}
▢ *Size:* ${res.result.fileSize}
▢ *Type:* ${res.result.mimetype}`)

    conn.sendMessage(
      m.chat,
      { document: { url: res.result.downloadUrl }, fileName: res.result.fileName, mimetype: res.result.mimetype },
      { quoted: m }
    )
    m.react(done)
  } catch (error) {
    console.error(error)
    m.reply('Error: ' + (error.message || 'Check the link or try another link'))
  }
}

handler.help = ['gdrive']
handler.tags = ['downloader', 'premium']
handler.command = ['gdrive']
handler.credit = true
handler.premium = true

export default handler