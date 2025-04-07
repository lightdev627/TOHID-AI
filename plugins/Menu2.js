import { createHash } from 'crypto'
import moment from 'moment-timezone'

const OwnerName = process.env.OWNER_NAME || 'TOHID KHAN';
const BOTNAME = process.env.BOTNAME || 'TOHID-AI';
const timeZone = process.env.TIME_ZONE || 'Asia/Kolkata';
const time = moment.tz(timeZone).format('HH');
let wib = moment.tz(timeZone).format('HH:mm:ss');

let handler = async (m, { conn, usedPrefix, command }) => {
    let d = new Date(new Date + 3600000)
    let locale = 'en'
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    
    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    if (!(who in global.db.data.users)) throw `✳️ The user is not found in my database`
    
    let pp = await conn.profilePictureUrl(who, 'image').catch(_ => './assets/A.jpg')
    let user = global.db.data.users[who]
    let { name, exp, diamond, lastclaim, registered, regTime, age, level, role, warn } = global.db.data.users[who]
    let { min, xp, max } = xpRange(user.level, global.multiplier)
    let username = conn.getName(who)
    let math = max - xp
    let prem = global.prems.includes(who.split`@`[0])
    let sn = createHash('md5').update(who).digest('hex')
    let totaluser = Object.values(global.db.data.users).length 
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length 
    let greeting = ucapan()
    let quote = quotes[Math.floor(Math.random() * quotes.length)];

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
◈├• 🤡  *Bot:* ${BOTNAME} 
◈├• 📣  *Prefix:* ${usedPrefix} 
◈├• 🕓  *Uptime:* ${uptime}
◈├• 💌  *Database:* ${rtotalreg} of ${totaluser} 
◈├• 📚  *Total Users:* ${totaluser}
◈╰─┬─★─☆──♪♪─❍
◈╭─┴❍「 *MAIN MENU* 」❍
◈├• *allmenu*
◈├• *aimenu*
◈├• *aeditor*
◈├• *animemenu*
◈├• *autoreact*
◈├• *botmenu*
◈├• *dlmenu*
◈├• *economy*
◈├• *enable*
◈├• *fancy*
◈├• *funmenu*
◈├• *gamesmenu*
◈├• *groupmenu*
◈├• *imagen*
◈├• *infoanime*
◈├• *listmenu*
◈├• *listplugin*
◈├• *logomenu*
◈├• *makermenu*
◈├• *menu*
◈├• *menu3*
◈├• *menu4*
◈├• *nsfwmenu*
◈├• *randompic*
◈├• *randomvid*
◈├• *reactions*
◈├• *stickermenu*
◈├• *textpro*
◈├• *toolsmenu*
◈├• *ownermenu*
◈├• *setprivacy*
◈╰─♪♪─★─☆──♪♪─❍
© *${BOTNAME}*

> 💡 *_Remember, when in doubt, use ${usedPrefix}listmenu or ${usedPrefix}help It's like my magic spell book!_* 💡
`

    await conn.sendMessage(m.chat, { 
        image: { url: pp }, 
        caption: str,
        mentions: [m.sender],
        contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            externalAdReply: {
                title: `${BOTNAME}`,
                body: "Your Personal WhatsApp Bot",
                thumbnailUrl: pp,
                sourceUrl: "https://wa.me/917849917350" + (conn.user.jid.split`@`[0]),
                mediaType: 1,
                renderLargerThumbnail: true
            },
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363207624903731@newsletter',
                newsletterName: `${BOTNAME} Bot Updates`,
                serverMessageId: 999
            }
        }
    }, { quoted: m })
    m.react('✅')
}

handler.help = ['main']
handler.tags = ['group']
handler.command = ['menu', 'help'] 

export default handler

function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function ucapan() {
    const time = moment.tz(timeZone).format('HH')
    let res = "Happy early in the day ☀️"
    if (time >= 4) {
        res = "Good Morning 🌄"
    }
    if (time >= 10) {
        res = "Good Afternoon ☀️"
    }
    if (time >= 15) {
        res = "Good Afternoon 🌇"
    }
    if (time >= 18) {
        res = "Good Night 🌙"
    }
    return res
}

const quotes = [
    "I'm not lazy, I'm just on my energy saving mode.",
    "Life is short, smile while you still have teeth.",
    // ... (keep your existing quotes array)
];
