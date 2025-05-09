const linkRegex = /chat.whatsapp.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i

// Store warning counts per user per group (chatId_senderId)
const warningCounts = new Map();

export async function before(m, { conn, isAdmin, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return !0;
  if (!m.isGroup) return !1;
  if (process.env.ANTILINK !== "true") return !0;

  let chat = global.db.data.chats[m.chat];
  let bot = global.db.data.settings[this.user.jid] || {};
  const isGroupLink = linkRegex.exec(m.text);

  if (chat.antiLink && isGroupLink && !isAdmin) {
    if (isBotAdmin) {
      const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`;
      if (m.text.includes(linkThisGroup)) return !0;
    }

    // Create unique key for this user in this group
    const warningKey = `${m.chat}_${m.sender}`;
    // Get current warnings or default to 0
    const currentWarnings = warningCounts.get(warningKey) || 0;

    if (currentWarnings < 3) {
      // Increment warning count
      warningCounts.set(warningKey, currentWarnings + 1);

      await conn.reply(
        m.chat,
        `*⚠️ Link Detected - Warning ${currentWarnings + 1}/3*\n\n` +
        `@${m.sender.split('@')[0]}, sharing group links is not allowed!\n` +
        `Next violation will result in ${currentWarnings === 2 ? 'removal from the group' : 'another warning'}.`,
        null,
        { mentions: [m.sender] }
      );

      // Delete the link message if bot is admin
      if (isBotAdmin) {
        await conn.sendMessage(m.chat, { delete: m.key });
      }
    } else {
      // Fourth violation - remove user
      await conn.reply(
        m.chat,
        `*🚫 Final Warning*\n\n` +
        `@${m.sender.split('@')[0]} has been removed for repeatedly sharing group links.`,
        null,
        { mentions: [m.sender] }
      );

      if (isBotAdmin) {
        await conn.sendMessage(m.chat, { delete: m.key });
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
      }

      // Reset warning count for this user
      warningCounts.delete(warningKey);
    }
  }
  return !0;
}
