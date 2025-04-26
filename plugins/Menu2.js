import { createHash } from 'crypto'
import PhoneNumber from 'awesome-phonenumber'
import { canLevelUp, xpRange } from '../lib/levelling.js'
import fetch from 'node-fetch'
import fs from 'fs'
const { levelling } = '../lib/levelling.js'
import moment from 'moment-timezone'
import { promises } from 'fs'
import { join } from 'path'
const OwnerName = process.env.OWNER_NAME || 'TOHID KHAN';
const BOTNAME = process.env.BOTNAME || 'TOHID-AI';
const timeZone = process.env.TIME_ZONE || 'Asia/Kolkata';
const time = moment.tz(timeZone).format('HH');
let wib = moment.tz(timeZone).format('HH:mm:ss');

let handler = async (m, { conn, usedPrefix, command}) => {
    let d = new Date(new Date + 3600000)
    let locale = 'en'
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
if (!(who in global.db.data.users)) throw `✳️ The user is not found in my database`
let pp = './assets/A.jpg'
let user = global.db.data.users[who]
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
let quote = quotes[Math.floor(Math.random() * quotes.length)];

let taguser = '@' + m.sender.split("@s.whatsapp.net")[0]
let str = `
🚀 *_Buckle up ${name}, ${greeting}! We're going on an adventure!_* 🚀
📋 *_Quote of the day: ${quote}_* 📋
◈╭──❍「 *USER INFO* 」❍
◈├• 🦸 *Owner:* ${OwnerName}
◈├• 🏆 *Rank:* ${role}
◈├• 🎮 *XP:* ${exp} 
◈├• 🎩 *USER*:${username}
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
◈├• *menu2*
◈├• *menu3*
◈├• *menu4*
◈├• *menu5*
◈├• *nsfwmenu*
◈├• *randompic*
◈├• *randomvid*
◈├• *reactions*
◈├• *stickermenu*
◈├• *textpro*
◈├• *toolsmenu*
◈├• *ownermenu*
◈├• *setprivacy*
◈├• *quranmenu*
◈├• *studymenu*
◈╰─♪♪─★─☆──♪♪─❍
© *${BOTNAME}*

> 💡 *_Remember, when in doubt, use ${usedPrefix}listmenu or ${usedPrefix}help It's like my magic spell book!_* 💡
`

    // Create interactive message with buttons
    const buttonMessage = {
        image: { url: pp },
        caption: str.trim(),
        footer: `*${BOTNAME}*`,
        headerType: 4,
        nativeFlowMessage: {
            buttons: [
                {
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                        title: "TAP TO OPEN",
                        sections: [{
                            title: "HERE IS ALL MENU CATEGORIES",
                            highlight_label: BOTNAME,
                            rows: [
                                // MAIN MENUS
                                { "header": "BOT MENUS", "title": "🤖 Bot Menu", "description": "The Bot's control panel", "id": `${usedPrefix}botmenu` },
                                { "header": "OWNER MENUS", "title": "👑 Owner Menu", "description": "For the bot owner", "id": `${usedPrefix}ownermenu` },
                                { "header": "GROUP MENUS", "title": "👥 Group Menu", "description": "Group management tools", "id": `${usedPrefix}groupmenu` },
                                
                                // AI & MEDIA
                                { "header": "AI MENUS", "title": "🧠 AI Menu", "description": "AI-powered features", "id": `${usedPrefix}aimenu` },
                                { "header": "AUDIO EDITORS", "title": "🎧 Audio Editor", "description": "Audio editing tools", "id": `${usedPrefix}aeditor` },
                                { "header": "DOWNLOAD MENUS", "title": "📥 Download Menu", "description": "Media download tools", "id": `${usedPrefix}dlmenu` },
                                
                                // ANIME
                                { "header": "ANIME MENUS", "title": "🍥 Anime Menu", "description": "Anime content", "id": `${usedPrefix}animemenu` },
                                { "header": "ANIME INFO", "title": "ℹ️ Anime Info", "description": "Anime information", "id": `${usedPrefix}infoanime` },
                                
                                // FUN & GAMES
                                { "header": "FUN MENUS", "title": "🎭 Fun Menu", "description": "Fun commands", "id": `${usedPrefix}funmenu` },
                                { "header": "GAMES MENUS", "title": "🎮 Games Menu", "description": "Interactive games", "id": `${usedPrefix}gamesmenu` },
                                { "header": "RANDOM PICS", "title": "🖼️ Random Pic", "description": "Random images", "id": `${usedPrefix}randompic` },
                                { "header": "RANDOM VIDEOS", "title": "🎥 Random Vid", "description": "Random videos", "id": `${usedPrefix}randomvid` },
                                { "header": "REACTIONS", "title": "💞 Reactions", "description": "Reaction commands", "id": `${usedPrefix}reactions` },
                                
                                // CREATION TOOLS
                                { "header": "FANCY TEXT", "title": "🖍️ Fancy Text", "description": "Text styling", "id": `${usedPrefix}fancy` },
                                { "header": "TEXT PRO", "title": "✏️ Text Pro", "description": "Advanced text tools", "id": `${usedPrefix}textpro` },
                                { "header": "LOGO MENUS", "title": "🏵️ Logo Menu", "description": "Logo creation", "id": `${usedPrefix}logomenu` },
                                { "header": "MAKER MENUS", "title": "🖌️ Maker Menu", "description": "Content creation", "id": `${usedPrefix}makermenu` },
                                { "header": "IMAGE MENUS", "title": "🖼️ Image Menu", "description": "Image tools", "id": `${usedPrefix}imagen` },
                                { "header": "STICKER MENUS", "title": "🫐 Sticker Menu", "description": "Sticker tools", "id": `${usedPrefix}stickermenu` },
                                
                                // UTILITIES
                                { "header": "TOOL MENUS", "title": "🧰 Tools Menu", "description": "Utility tools", "id": `${usedPrefix}toolsmenu` },
                                { "header": "ECONOMY MENUS", "title": "💰 Economy", "description": "Virtual economy", "id": `${usedPrefix}economy` },
                                { "header": "LIST MENUS", "title": "📜 List Menu", "description": "Command lists", "id": `${usedPrefix}listmenu` },
                                { "header": "STUDY MENUS", "title": "📚 Study Menu", "description": "Educational tools", "id": `${usedPrefix}studymenu` },
                                
                                // SETTINGS
                                { "header": "SETTINGS", "title": "⚙️ Enable/Disable", "description": "Toggle features", "id": `${usedPrefix}enable` },
                                { "header": "PRIVACY", "title": "🔒 Privacy", "description": "Privacy settings", "id": `${usedPrefix}setprivacy` },
                                { "header": "ALL PLUGINS", "title": "🧩 Plugins", "description": "Plugin management", "id": `${usedPrefix}listplugin` },
                                
                                // SPECIAL
                                { "header": "QURAN PAK", "title": "📖 Quran Menu", "description": "Islamic resources", "id": `${usedPrefix}quranmenu` },
                                { "header": "NSFW MENUS", "title": "🌙 NSFW Menu", "description": "Adult content (18+)", "id": `${usedPrefix}nsfwmenu` },
                                { "header": "AUTOMATIC REACTION", "title": "🤖 Auto React", "description": "Automatic reactions", "id": `${usedPrefix}autoreact` }
                            ]
                        }]
                    })
                },
                // Quick Reply Buttons
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "📜 ALL MENU",
                        id: `${usedPrefix}allmenu`
                    })
                },
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "📱 MENU2",
                        id: `${usedPrefix}menu2`
                    })
                },
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "📲 MENU3",
                        id: `${usedPrefix}menu3`
                    })
                },
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "📶 MENU4",
                        id: `${usedPrefix}menu4`
                    })
                },
                
                // URL Buttons
                {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "🌟 OWNER",
                        url: "https://wa.me/message/O6KWTGOGTVTYO1"
                    })
                },
                {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "💻 SOURCE",
                        url: "https://github.com/Tohidkhan6332/TOHID-AI"
                    })
                },
                {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "👥 GROUP",
                        url: "https://chat.whatsapp.com/IqRWSp7pXx8DIMtSgDICGu"
                    })
                },
                {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "📢 CHANNEL",
                        url: "https://whatsapp.com/channel/0029VaGyP933bbVC7G0x0i2T"
                    })
                },
                {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "📚 DOCS",
                        url: "https://github.com/Tohidkhan6332/TOHID-AI#readme"
                    })
                }
            ]
        }
    }

    await conn.sendMessage(m.chat, buttonMessage, { quoted: m })
    m.react(done)
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
    const time = moment.tz('Asia/Kolkata').format('HH')
    let res = "happy early in the day☀️"
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
      "I may be a bad influence, but darn I am fun!",
      "I'm on a whiskey diet. I've lost three days already.",
      "Why don't some couples go to the gym? Because some relationships don't work out.",
      "I told my wife she should embrace her mistakes... She gave me a hug.",
      "I'm great at multitasking. I can waste time, be unproductive, and procrastinate all at once.",
      "You know you're getting old when you stoop to tie your shoelaces and wonder what else you could do while you're down there.",
      "I'm so good at sleeping, I can do it with my eyes closed.",
      "If you think nobody cares if you’re alive, try missing a couple of payments.",
      "I used to think I was indecisive, but now I'm not so sure.",
      "If you can't convince them, confuse them.",
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "I'm not clumsy, I'm just on a mission to test gravity.",
      "I told my wife she should do more push-ups. She said, 'I could do a hundred!' So I counted to ten and stopped.",
      "Life is like a box of chocolates; it doesn't last long if you're hungry.",
      "I'm not saying I'm Wonder Woman, I'm just saying no one has ever seen me and Wonder Woman in the same room together.",
      "Why do they call it beauty sleep when you wake up looking like a troll?",
      "I don't always lose my phone, but when I do, it's always on silent.",
      "My bed is a magical place where I suddenly remember everything I was supposed to do.",
      "I love the sound you make when you shut up.",
      "I'm not arguing, I'm just explaining why I'm right.",
      "I'm not a complete idiot, some parts are missing.",
      "When life gives you lemons, squirt someone in the eye.",
      "I don't need anger management. You just need to stop making me angry.",
      "I'm not saying I'm Batman. I'm just saying no one has ever seen me and Batman in the same room together.",
      "I'm not saying I'm Superman. I'm just saying no one has ever seen me and Superman in the same room together.",
      "I'm not saying I'm Spider-Man. I'm just saying no one has ever seen me and Spider-Man in the same room together.",
      "I'm not saying I'm a superhero. I'm just saying no one has ever seen me and a superhero in the same room together.",
      "The early bird can have the worm because worms are gross and mornings are stupid.",
      "If life gives you lemons, make lemonade. Then find someone whose life has given them vodka and have a party!",
      "The road to success is always under construction.",
      "I am so clever that sometimes I don't understand a single word of what I am saying.",
      "Some people just need a high-five. In the face. With a chair.",
      "I'm not saying I'm perfect, but I'm pretty close.",
      "A day without sunshine is like, you know, night.",
      "The best way to predict the future is to create it.",
      "If you can't be a good example, then you'll just have to be a horrible warning.",
      "I don't know why I keep hitting the escape button. I'm just trying to get out of here.",
      "I'm not lazy. I'm on energy-saving mode.",
      "I don't need a hairstylist, my pillow gives me a new hairstyle every morning.",
      "I don't have a bad handwriting, I have my own font.",
      "I'm not clumsy. It's just the floor hates me, the table and chairs are bullies, and the walls get in my way.",
      "I'm not saying I'm Batman. I'm just saying no one has ever seen me and Batman in the same room together.",
      "I'm not saying I'm Wonder Woman. I'm just saying no one has ever seen me and Wonder Woman in the same room together.",
      "I'm not saying I'm Superman. I'm just saying no one has ever seen me and Superman in the same room together.",
      "I'm not saying I'm Spider-Man. I'm just saying no one has ever seen me and Spider-Man in the same room together.",
      "I'm not saying I'm a superhero. I'm just saying no one has ever seen me and a superhero in the same room together."
      ];
