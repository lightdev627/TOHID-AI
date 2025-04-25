import pkg from '@whiskeysockets/baileys';
const { proto, prepareWAMessageMedia, generateWAMessageFromContent } = pkg;
import moment from 'moment-timezone';
import { createHash } from 'crypto';
import { xpRange } from '../lib/levelling.js';

let handler = async (m, { conn, usedPrefix }) => {
    let d = new Date(new Date() + 3600000);
    let locale = 'en';
    let week = d.toLocaleDateString(locale, { weekday: 'long' });
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
    let _uptime = process.uptime() * 1000;
    let uptime = clockString(_uptime);

    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    if (!(who in global.db.data.users)) throw `✳️ The user is not found in my database`;

    let user = global.db.data.users[who];
    let { level } = user;
    let { min, xp, max } = xpRange(level, global.multiplier);
    let greeting = ucapan();

    let str = `
      『 *TOHID-AI* 』  
      © 2025 *Tohidkhan6332*`;

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
                        ...(await prepareWAMessageMedia({ image: { url: './assets/tohid2.jpg' } }, { upload: conn.waUploadToServer })),
                        title: null,
                        subtitle: null,
                        hasMediaAttachment: false
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons: [
                            {
                                "name": "single_select",
                                "buttonParamsJson": JSON.stringify({
                                    "title": "TAP TO OPEN",
                                    "sections": [{
                                        "title": "HERE IS ALL MENU CATEGORIES",
                                        "highlight_label": "TOHID-AI",
                                        "rows": [
                                            // MAIN MENUS
                                            { "header": "MAIN MENUS", "title": "🤖 Bot Menu", "description": "The Bot's control panel", "id": `${usedPrefix}botmenu` },
                                            { "header": "MAIN MENUS", "title": "👑 Owner Menu", "description": "For the bot owner", "id": `${usedPrefix}ownermenu` },
                                            { "header": "MAIN MENUS", "title": "👥 Group Menu", "description": "Group management tools", "id": `${usedPrefix}groupmenu` },
                                            
                                            // AI & MEDIA
                                            { "header": "AI & MEDIA", "title": "🧠 AI Menu", "description": "AI-powered features", "id": `${usedPrefix}aimenu` },
                                            { "header": "AI & MEDIA", "title": "🎧 Audio Editor", "description": "Audio editing tools", "id": `${usedPrefix}aeditor` },
                                            { "header": "AI & MEDIA", "title": "📥 Download Menu", "description": "Media download tools", "id": `${usedPrefix}dlmenu` },
                                            
                                            // ANIME
                                            { "header": "ANIME", "title": "🍥 Anime Menu", "description": "Anime content", "id": `${usedPrefix}animemenu` },
                                            { "header": "ANIME", "title": "ℹ️ Anime Info", "description": "Anime information", "id": `${usedPrefix}infoanime` },
                                            
                                            // FUN & GAMES
                                            { "header": "FUN & GAMES", "title": "🎭 Fun Menu", "description": "Fun commands", "id": `${usedPrefix}funmenu` },
                                            { "header": "FUN & GAMES", "title": "🎮 Games Menu", "description": "Interactive games", "id": `${usedPrefix}gamesmenu` },
                                            { "header": "FUN & GAMES", "title": "🖼️ Random Pic", "description": "Random images", "id": `${usedPrefix}randompic` },
                                            { "header": "FUN & GAMES", "title": "🎥 Random Vid", "description": "Random videos", "id": `${usedPrefix}randomvid` },
                                            { "header": "FUN & GAMES", "title": "💞 Reactions", "description": "Reaction commands", "id": `${usedPrefix}reactions` },
                                            
                                            // CREATION TOOLS
                                            { "header": "CREATION TOOLS", "title": "🖍️ Fancy Text", "description": "Text styling", "id": `${usedPrefix}fancy` },
                                            { "header": "CREATION TOOLS", "title": "✏️ Text Pro", "description": "Advanced text tools", "id": `${usedPrefix}textpro` },
                                            { "header": "CREATION TOOLS", "title": "🏵️ Logo Menu", "description": "Logo creation", "id": `${usedPrefix}logomenu` },
                                            { "header": "CREATION TOOLS", "title": "🖌️ Maker Menu", "description": "Content creation", "id": `${usedPrefix}makermenu` },
                                            { "header": "CREATION TOOLS", "title": "🖼️ Image Menu", "description": "Image tools", "id": `${usedPrefix}imagen` },
                                            { "header": "CREATION TOOLS", "title": "🫐 Sticker Menu", "description": "Sticker tools", "id": `${usedPrefix}stickermenu` },
                                            
                                            // UTILITIES
                                            { "header": "UTILITIES", "title": "🧰 Tools Menu", "description": "Utility tools", "id": `${usedPrefix}toolsmenu` },
                                            { "header": "UTILITIES", "title": "💰 Economy", "description": "Virtual economy", "id": `${usedPrefix}economy` },
                                            { "header": "UTILITIES", "title": "📜 List Menu", "description": "Command lists", "id": `${usedPrefix}listmenu` },
                                            { "header": "UTILITIES", "title": "📚 Study Menu", "description": "Educational tools", "id": `${usedPrefix}studymenu` },
                                            
                                            // SETTINGS
                                            { "header": "SETTINGS", "title": "⚙️ Enable/Disable", "description": "Toggle features", "id": `${usedPrefix}enable` },
                                            { "header": "SETTINGS", "title": "🔒 Privacy", "description": "Privacy settings", "id": `${usedPrefix}setprivacy` },
                                            { "header": "SETTINGS", "title": "🧩 Plugins", "description": "Plugin management", "id": `${usedPrefix}listplugin` },
                                            
                                            // SPECIAL
                                            { "header": "SPECIAL", "title": "📖 Quran Menu", "description": "Islamic resources", "id": `${usedPrefix}quranmenu` },
                                            { "header": "SPECIAL", "title": "🌙 NSFW Menu", "description": "Adult content (18+)", "id": `${usedPrefix}nsfwmenu` },
                                            { "header": "SPECIAL", "title": "🤖 Auto React", "description": "Automatic reactions", "id": `${usedPrefix}autoreact` }
                                        ]
                                    }]
                                })
                            },
                            // Quick Reply Buttons
                            {
                                "name": "quick_reply",
                                "buttonParamsJson": JSON.stringify({
                                    "display_text": "📜 ALL MENU",
                                    "id": `${usedPrefix}allmenu`
                                })
                            },
                            {
                                "name": "quick_reply",
                                "buttonParamsJson": JSON.stringify({
                                    "display_text": "📱 MENU2",
                                    "id": `${usedPrefix}menu2`
                                })
                            },
                            {
                                "name": "quick_reply",
                                "buttonParamsJson": JSON.stringify({
                                    "display_text": "📲 MENU3",
                                    "id": `${usedPrefix}menu3`
                                })
                            },
                            {
                                "name": "quick_reply",
                                "buttonParamsJson": JSON.stringify({
                                    "display_text": "📶 MENU4",
                                    "id": `${usedPrefix}menu4`
                                })
                            },
                            
                            // URL Buttons
                            {
                                "name": "cta_url",
                                "buttonParamsJson": JSON.stringify({
                                    "display_text": "🌟 OWNER",
                                    "url": "https://wa.me/message/O6KWTGOGTVTYO1"
                                })
                            },
                            {
                                "name": "cta_url",
                                "buttonParamsJson": JSON.stringify({
                                    "display_text": "💻 SOURCE",
                                    "url": "https://github.com/Tohidkhan6332/TOHID-AI"
                                })
                            },
                            {
                                "name": "cta_url",
                                "buttonParamsJson": JSON.stringify({
                                    "display_text": "👥 GROUP",
                                    "url": "https://chat.whatsapp.com/IqRWSp7pXx8DIMtSgDICGu"
                                })
                            },
                            {
                                "name": "cta_url",
                                "buttonParamsJson": JSON.stringify({
                                    "display_text": "📢 CHANNEL",
                                    "url": "https://whatsapp.com/channel/0029VaGyP933bbVC7G0x0i2T"
                                })
                            },
                            {
                                "name": "cta_url",
                                "buttonParamsJson": JSON.stringify({
                                    "display_text": "📚 DOCS",
                                    "url": "https://github.com/Tohidkhan6332/TOHID-AI#readme"
                                })
                            }
                        ],
                    })
                })
            }
        }
    }, {});

    await conn.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
    });
}

handler.help = ['main'];
handler.tags = ['group'];
handler.command = ['menu2', 'help2', 'h', 'commands2'];

export default handler;

function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}

function ucapan() {
    const time = moment.tz('Asia/Karachi').format('HH');
    let res = "happy early in the day☀️";
    if (time >= 4) {
        res = "Good Morning 🥱";
    }
    if (time >= 10) {
        res = "Good Afternoon 🫠";
    }
    if (time >= 15) {
        res = "Good Afternoon 🌇";
    }
    if (time >= 18) {
        res = "Good Night 🌙";
    }
    return res;
}