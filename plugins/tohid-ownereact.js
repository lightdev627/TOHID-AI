
export const disabled = false;

export async function before(m, { conn }) {
  const OWNER_ID = 'owner@s.whatsapp.net'; // 🧙 Replace with the actual owner ID
  const SPECIAL_USERS = [
    '917849917350@s.whatsapp.net',
    '918930358452@s.whatsapp.net',
    '917849917350@s.whatsapp.net',
  ]; // 🦄 Enchanted users who get reactions

  // 🚫 Ignore if not a group message
  if (!m.isGroup) return;

  // ✨ If the owner is mentioned in the message
  if (m.mentionedJid?.includes(OWNER_ID)) {
    try {
      const reply = `🧙‍♂️✨ *You summoned the master of magic!* How can I help, ${conn.getName(m.sender)}?`;

      await conn.reply(m.chat, reply, m, { mentions: [m.sender] });

      await conn.sendMessage(m.chat, {
        react: {
          text: '💖', // Emoji reaction for owner mention
          key: m.key,
        },
      });
    } catch (err) {
      console.error("❌ Error on owner mention reaction:", err);
    }
  }

  // 💫 If a special user sends a message
  if (SPECIAL_USERS.includes(m.sender)) {
    try {
      await conn.sendMessage(m.chat, {
        react: {
          text: '🦄', // Magical emoji for VIP users
          key: m.key,
        },
      });
    } catch (err) {
      console.error("❌ Error reacting to special user:", err);
    }
  }
}
