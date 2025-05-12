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
    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    if (!(who in global.db.data.users)) throw `✳️ The user is not found in my database`

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

    let str = `❤️ *_Hello ${name}, ${greeting}! Welcome to my button menu!* 🥳
╭═══〘 𝐓𝐎𝐇𝐈𝐃-𝐀𝐈 𝐁𝐎𝐓 〙═══⊷❍
┃◈├•━━━❮❮ CMD LINE ❯❯━━━━
┃◈├• 🦸 𝙽𝚊𝚖𝚎: ${global.author}
┃◈├• 📚 𝚃𝚘𝚝𝚊𝚕: 1000+ Features
┃◈├• 🖥️ Network:LTE
┃◈├• 💌 ᴠᴇʀꜱɪᴏɴ: BETA
┃◈├• 👑 ᴏᴡɴᴇʀ : *𝐌𝐑 𝐓𝐎𝐇𝐈𝐃*
┃◈├• 📟 ɴᴜᴍʙᴇʀ: 917849917350
┃◈├• 💯 HOSTER: *Tohid Platform*
┃◈├• 🇮🇳 ᴍᴏᴅᴇ: *Unkown*
┃◈├• 🎛️ ᴘʀᴇғɪx: *Multi-Prefix*
┃◈├• 🕓 Uptime: ${uptime}
┃◈├• 📆 Today's Date: ${date}
┃◈├• ⏲️ Current Time: ${wib}
┃◈├•──────────●●►
┃◈├ ╔═╦═╗───╔══╗╔╗╔╗╔╗
┃◈├ ║║║║╠╦╦═╩╗╔╩╣╚╬╬╝║
┃◈├ ║║║║║╔╩══╣║╬║║║║╬║
┃◈├ ╚╩═╩╩╝───╚╩═╩╩╩╩═╝
┃◈├•──────────●●►
┃◈╰─┬─★─☆──♪♪─❍
┃◈╭─┴❍「 *MAIN MENU* 」❍
┃◈├• *allmenu*
┃◈├• *aimenu*
┃◈├• *aeditor*
┃◈├• *animemenu*
┃◈├•• *botmenu*
┃◈├• *dlmenu*
┃◈├• *economy*
┃◈├• *enable*
┃◈├• *fancy*
┃◈├• *funmenu*
┃◈├• *gamesmenu*
┃◈├• *groupmenu*
┃◈├• *imagen*
┃◈├• *infoanime*
┃◈├• *listmenu*
┃◈├• *listplugin*
┃◈├• *logomenu*
┃◈├• *makermenu*
┃◈├• *menu*
┃◈├• *menu2*
┃◈├• *menu3*
┃◈├• *menu4*
┃◈├• *menu5*
┃◈├• *nsfwmenu*
┃◈├• *randompic*
┃◈├• *randomvid*
┃◈├• *reactions*
┃◈├• *stickermenu*
┃◈├• *textpro*
┃◈├• *toolsmenu*
┃◈├• *ownermenu*
┃◈├• *setprivacy*
┃◈├• *studymenu*
┃◈├• *quranmenu*
┃◈╰─♪♪─★─☆──♪♪─❍
╰═══〘 𝐓𝐎𝐇𝐈𝐃-𝐀𝐈 𝐁𝐎𝐓 〙═══⊷❍`

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
                            image: { url: 'https://qu.ax/PPsGw.jpg' }
                        }, { upload: conn.waUploadToServer })),
                        title: null,
                        subtitle: null,
                        hasMediaAttachment: false
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons: [
                            {
                                 "name": "single_select",
  "buttonParamsJson": "{\"title\":\"TAP TO OPEN\",\"sections\":[{\"title\":\"HERE IS ALL LIST OF MENU\",\"highlight_label\":\"TOHID-AI\",\"rows\":[{\"header\":\"\",\"title\":\"💀 Bot Menu\",\"description\":\"The Bot's secret control panel. What's your command, oh great one?\",\"id\":\".botmenu\"},{\"header\":\"\",\"title\":\"📚 Owner Menu\",\"description\":\"The sacred scroll only for the chosen one. Yep, that's you, Boss!\",\"id\":\".ownermenu\"},{\"header\":\"\",\"title\":\"🧑‍🤝‍🧑 Group Menu\",\"description\":\"Group shenanigans central! Unite, chat, conquer!\",\"id\":\".groupmenu\"},{\"header\":\"\",\"title\":\"🤖 AI Menu\",\"description\":\"Artificial Intelligence at your service. Ask and you shall receive!\",\"id\":\".aimenu\"},{\"header\":\"\",\"title\":\"🎨 AI Editor\",\"description\":\"Creative tools powered by AI. Transform your ideas into reality!\",\"id\":\".aeditor\"},{\"header\":\"\",\"title\":\"📥 Download Menu\",\"description\":\"'DL' stands for 'Delicious Loot'. Come grab your goodies!\",\"id\":\".dlmenu\"},{\"header\":\"\",\"title\":\"🌸 Anime Menu\",\"description\":\"Everything anime - because weeb life is best life!\",\"id\":\".animemenu\"},{\"header\":\"\",\"title\":\"ℹ️ Anime Info\",\"description\":\"Get detailed information about your favorite anime shows!\",\"id\":\".infoanime\"},{\"header\":\"\",\"title\":\"🎉 Fun Menu\",\"description\":\"The bot's party hat. Games, jokes and instant ROFLs. Let's get this party started!\",\"id\":\".funmenu\"},{\"header\":\"\",\"title\":\"🎮 Games Menu\",\"description\":\"Enter the gaming arena. May the odds be ever in your favor!\",\"id\":\".gamesmenu\"},{\"header\":\"\",\"title\":\"🖼️ Random Pic\",\"description\":\"Surprise images at your fingertips. What will appear next?\",\"id\":\".randompic\"},{\"header\":\"\",\"title\":\"🎥 Random Video\",\"description\":\"Random videos to entertain or confuse - you decide!\",\"id\":\".randomvid\"},{\"header\":\"\",\"title\":\"😄 Reactions\",\"description\":\"Express yourself with fun reaction commands!\",\"id\":\".reactions\"},{\"header\":\"\",\"title\":\"✨ Fancy Text\",\"description\":\"Make your text stand out with fancy styling!\",\"id\":\".fancy\"},{\"header\":\"\",\"title\":\"🅿️ Text Pro\",\"description\":\"Advanced text effects and generators!\",\"id\":\".textpro\"},{\"header\":\"\",\"title\":\"🎩 Logo Menu\",\"description\":\"Create a logo that screams YOU. Or whispers. You choose the volume.\",\"id\":\".logomenu\"},{\"header\":\"\",\"title\":\"🛠️ Maker Menu\",\"description\":\"Creation tools for various media content!\",\"id\":\".makermenu\"},{\"header\":\"\",\"title\":\"🎨 Sticker Menu\",\"description\":\"A rainbow of stickers for your inner artist. Make your chats pop!\",\"id\":\".stickermenu\"},{\"header\":\"\",\"title\":\"🧰 Tools Menu\",\"description\":\"Your handy-dandy toolkit. What's your pick, genius?\",\"id\":\".toolsmenu\"},{\"header\":\"\",\"title\":\"💰 Economy\",\"description\":\"Bling bling! Your personal vault of virtual economy. Spend or save? Choose wisely!\",\"id\":\".economy\"},{\"header\":\"\",\"title\":\"📖 Study Menu\",\"description\":\"Educational tools and resources for learning!\",\"id\":\".studymenu\"},{\"header\":\"\",\"title\":\"✅ Enable Features\",\"description\":\"Toggle various bot features on/off!\",\"id\":\".enable\"},{\"header\":\"\",\"title\":\"🔒 Set Privacy\",\"description\":\"Configure your privacy settings for the bot!\",\"id\":\".setprivacy\"},{\"header\":\"\",\"title\":\"📋 Plugin List\",\"description\":\"View all available plugins and their status!\",\"id\":\".listplugin\"},{\"header\":\"\",\"title\":\"📿 Quran Menu\",\"description\":\"Islamic resources and Quranic tools!\",\"id\":\".quranmenu\"},{\"header\":\"\",\"title\":\"🌙 NSFW Menu\",\"description\":\"The After Dark menu. But remember, sharing adult secrets must be consent-based.\",\"id\":\".nsfwmenu\"},{\"header\":\"\",\"title\":\"⚡ Auto React\",\"description\":\"Configure automatic reactions to messages!\",\"id\":\".autoreact\"}]}]}" 
                },
                            {
                                "name": "quick_reply",
                                "buttonParamsJson": "{\"display_text\":\"MAIN MENU 📜☠️\",\"id\":\".menu\"}"
                            },
                             {
                                "name": "quick_reply",
                                "buttonParamsJson": "{\"display_text\":\"ALL MENU 📚\",\"id\":\".allmenu\"}"
                            },
                            {
                                "name": "quick_reply",
                                "buttonParamsJson": "{\"display_text\":\"BOT OWNER 👑🇮🇳\",\"id\":\".owner\"}"
                            },
                            {
                                "name": "cta_url",
                                "buttonParamsJson": "{\"display_text\":\"BOT SC 🎉\",\"url\":\"https://github.com/Tohidkhan6332/TOHID-AI\",\"merchant_url\":\"https://github.com/Tohidkhan6332\"}"
                            }
                        ]
                    })
                })
            }
        }
    }, {})

    // Sending audio with image and context info
    await conn.sendMessage(m.chat, {
        audio: { url: 'https://github.com/Tohidkhan6332/TOHID-DATA/raw/refs/heads/main/autovoice/menunew.m4a' },
        image: { url: 'https://qu.ax/PPsGw.jpg' }, // Change this to a dynamic thumbnail URL
        caption: str,
        contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363207624903731@newsletter',
                newsletterName: 'TOHID-AI BUTTON MENU',
                serverMessageId: 143
            }
        }
    })

    await conn.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
    })
}

handler.help = ['main']
handler.tags = ['group']
handler.command = ['menu3', 'help3', 'h3', 'commands3']

export default handler

function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function ucapan() {
    const time = moment.tz('Africa/Nairobi').format('HH')
    let res = "happy early in the day☀️"
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
