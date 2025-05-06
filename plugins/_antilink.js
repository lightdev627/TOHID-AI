const linkRegex = /(?:chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})|https:\/\/whatsapp\.com\/channel\/[0-9A-Za-z]+)/i;

export async function before(m, { conn, isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return true;
    if (!m.isGroup) return false;

    let chat = global.db.data.chats[m.chat];
    if (typeof chat !== 'object') global.db.data.chats[m.chat] = {};
    chat = global.db.data.chats[m.chat];

    // Check if message contains a group link and antiLink is enabled
    const isGroupLink = linkRegex.exec(m.text);
    if (!chat.antiLink || !isGroupLink || isAdmin) return true;

    const linkThisGroup = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`;
    if (m.text.includes(linkThisGroup)) return true; // Allow same group link

    if (!isBotAdmin) {
        console.log("Bot is not an admin, cannot take action.");
        return true;
    }

    // Different anti-link modes
    const antiLinkMode = chat.antiLinkMode || 'delete'; // Default: delete only
    const sender = m.sender;

    switch (antiLinkMode) {
        case 'delete': // Just delete the message
            await conn.sendMessage(m.chat, { delete: m.key });
            break;

        case 'warn': // Delete + 3 warnings before kick
            if (!chat.warnedUsers) chat.warnedUsers = {};
            if (!chat.warnedUsers[sender]) chat.warnedUsers[sender] = 0;

            chat.warnedUsers[sender]++;
            const warnings = chat.warnedUsers[sender];

            await conn.sendMessage(m.chat, { delete: m.key });
            await conn.reply(
                m.chat,
                `⚠️ *Link Detected!* (Warning ${warnings}/3)\n@${sender.split('@')[0]}, please avoid sharing group links.`,
                m,
                { mentions: [sender] }
            );

            if (warnings >= 3) {
                await conn.groupParticipantsUpdate(m.chat, [sender], 'remove');
                delete chat.warnedUsers[sender];
            }
            break;

        case 'kick': // Direct remove without warning
            await conn.sendMessage(m.chat, { delete: m.key });
            await conn.reply(
                m.chat,
                `🚫 *Link Detected!*\n@${sender.split('@')[0]} has been removed for sharing a group link.`,
                m,
                { mentions: [sender] }
            );
            await conn.groupParticipantsUpdate(m.chat, [sender], 'remove');
            break;
    }

    return true;
}