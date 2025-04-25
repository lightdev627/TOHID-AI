import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
const {
    proto,
    generateWAMessage,
    areJidsSameUser,
    prepareWAMessageMedia
} = (await import('@whiskeysockets/baileys')).default
import { createHash } from 'crypto'
import PhoneNumber from 'awesome-phonenumber'
import { canLevelUp, xpRange } from '../lib/levelling.js'

import fetch from 'node-fetch'
import fs from 'fs'
const { levelling } = '../lib/levelling.js'
import moment from 'moment-timezone'
import { promises } from 'fs'
import { join } from 'path'
const time = moment.tz('Africa/Nairobi').format('HH')
let wib = moment.tz('Africa/Nairobi').format('HH:mm:ss')

let handler = async (m, { conn, usedPrefix, command }) => {
    let d = new Date(new Date + 3600000)
    let locale = 'en'
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    if (!(who in global.db.data.users)) throw `✳️ The user is not found in my database`

    // Define missing variables
    let quote = "The journey of a thousand miles begins with one step."
    let OwnerName = conn.getName(conn.user.jid) || "Bot Owner"
    let botname = conn.user.name || "TOHID-AI BOT"

    let user = global.db.data.users[m.sender]
    let { name, exp, diamond, lastclaim, registered, regTime, age, level, role, warn } = global.db.data.users[who]
    let { min, xp, max } = xpRange(user.level, global.multiplier)
    let username = conn.getName(who)
    let math = max - xp
    let prem = global.prems.includes(who.split`@`[0])
    let sn = createHash('md5').update(who).digest('hex')
    let totaluser = Object.values(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let more = String.fromCharCode(8206)
    let readMore = more.repeat(850)
    let greeting = ucapan()
    let taguser = '@' + m.sender.split("@s.whatsapp.net")[0]

    let str = `
🚀 *_Buckle up ${name}, ${greeting}! We're going on an adventure!_* 🚀
📋 *_Quote of the day: ${quote}_* 📋
◈╭──❍「 *USER INFO* 」❍
◈├• 🦸 *Owner:* ${OwnerName}
◈├• 🏆 *Rank:* ${role}
◈├• 🎮 *XP:* ${exp} 
◈├• 🎩 *USER*: ${username}
◈╰─┬─★─☆──♪♪─❍
◈╭─┴❍「 *BOT STATUS* 」❍
◈├• 📆  *Date:* ${date}
◈├• ⏲️  *Time:* ${wib}
◈├• 🤡  *Bot:* ${botname} 
◈├• 📣  *Prefix:* ${usedPrefix} 
◈├• 🕓  *Uptime:* ${uptime}
◈├• 💌  *Database:* ${rtotalreg} of ${totaluser} 
◈├• 📚  *Total Users:* ${totaluser}
◈╰─┬─★─☆──♪♪─❍
─═✧✧═─ 𝐓𝐎𝐇𝐈𝐃-𝐀𝐈 𝐁𝐎𝐓 ─═✧✧═─`

    // Prepare the image
    let image = await (await fetch('./assets/tohid2.jpg')).buffer()
    
    // Create the interactive message with all buttons
    let msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                "messageContextInfo": {
                    "deviceListMetadata": {},
                    "deviceListMetadataVersion": 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: str
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: "Use The Below Buttons"
                    }),
                    header: proto.Message.InteractiveMessage.Header.create({
                        ...(await prepareWAMessageMedia({
                            image: image
                        }, { upload: conn.waUploadToServer })),
                        title: null,
                        subtitle: null,
                        hasMediaAttachment: true
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons: [
                            {
                                "name": "single_select",
                                "buttonParamsJson": JSON.stringify({
                                    "title": "TAP TO OPEN",
                                    "sections": [{
                                        "title": "HERE IS ALL LIST OF MENU",
                                        "highlight_label": "TOHID-AI",
                                        "rows": [
                                            {"header": "", "title": "💀 Bot Menu", "description": "The Bot's secret control panel", "id": ".botmenu"},
                                            {"header": "", "title": "📚 Owner Menu", "description": "The sacred scroll only for the chosen one", "id": ".ownermenu"},
                                            {"header": "", "title": "🧑‍🤝‍🧑 Group Menu", "description": "Group shenanigans central!", "id": ".groupmenu"},
                                            {"header": "", "title": "📥 Download Menu", "description": "Come grab your goodies!", "id": ".dlmenu"},
                                            {"header": "", "title": "🎉 Fun Menu", "description": "Let's get this party started!", "id": ".funmenu"},
                                            {"header": "", "title": "💰 Economy Menu", "description": "Your personal vault of virtual economy", "id": ".economymenu"},
                                            {"header": "", "title": "🎮 Game Menu", "description": "Enter the gaming arena", "id": ".gamemenu"},
                                            {"header": "", "title": "🎨 Sticker Menu", "description": "Make your chats pop!", "id": ".stickermenu"},
                                            {"header": "", "title": "🧰 Tool Menu", "description": "Your handy-dandy toolkit", "id": ".toolmenu"},
                                            {"header": "", "title": "🎩 Logo Menu", "description": "Create a logo that screams YOU", "id": ".logomenu"},
                                            {"header": "", "title": "🌙 NSFW Menu", "description": "The After Dark menu", "id": ".nsfwmenu"}
                                        ]
                                    }]
                                })
                            },
                            {
                                "name": "quick_reply",
                                "buttonParamsJson": JSON.stringify({"display_text": "Owner👑❤️", "id": ".owner"})
                            },
                            {
                                "name": "quick_reply",
                                "buttonParamsJson": JSON.stringify({"display_text": "MENU 📲", "id": ".menu"})
                            },
                            {
                                "name": "quick_reply",
                                "buttonParamsJson": JSON.stringify({"display_text": "ALL MENU 🇮🇳", "id": ".allmenu"})
                            },
                            {
                                "name": "quick_reply",
                                "buttonParamsJson": JSON.stringify({"display_text": "MENU3 🇮🇳", "id": ".menu3"})
                            },
                            {
                                "name": "quick_reply",
                                "buttonParamsJson": JSON.stringify({"display_text": "MENU4 🇮🇳", "id": ".menu4"})
                            },
                            {
                                "name": "cta_url",
                                "buttonParamsJson": JSON.stringify({"display_text": "BOT SC 🇮🇳", "url": "https://github.com/Tohidkhan6332/TOHID-AI"})
                            },
                            {
                                "name": "cta_url",
                                "buttonParamsJson": JSON.stringify({"display_text": "BOT GROUP 🇮🇳", "url": "https://chat.whatsapp.com/IqRWSp7pXx8DIMtSgDICGu"})
                            },
                            {
                                "name": "cta_url",
                                "buttonParamsJson": JSON.stringify({"display_text": "BOT CHENNAL 🇮🇳", "url": "https://whatsapp.com/channel/0029VaGyP933bbVC7G0x0i2T"})
                            }
                        ]
                    })
                })
            }
        }
    }, {})

    // Send audio first
    await conn.sendMessage(m.chat, { 
        audio: { url: 'https://github.com/Tohidkhan6332/TOHID-AI/raw/main/assets/tohid.mp3' },
        mimetype: 'audio/mp4',
        ptt: false
    }, { quoted: m })

    // Then send the interactive message
    await conn.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
    })
}

handler.help = ['main']
handler.tags = ['group']
handler.command = ['menu2', 'help2', 'h2', 'commands2']

export default handler

function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function ucapan() {
    const time = moment.tz('Africa/Nairobi').format('HH')
    let res = "Happy early in the day ☀️"
    if (time >= 4) {
        res = "Good Morning 🥱"
    }
    if (time >= 10) {
        res = "Good Afternoon 🫠"
    }
    if (time >= 15) {
        res = "Good Afternoon 🌇"
    }
    if (time >= 18) {
        res = "Good Night 🌙"
    }
    return res
}