handler.command = ['setantilink'];
handler.admin = true;
handler.tags = ['group'];
handler.help = ['setantilink <mode>'];
handler.before = async function(m, { conn, isAdmin, text }) {
  if (!isAdmin) return;
  const mode = text.toLowerCase();
  if (!['delete', 'warn', 'kick'].includes(mode)) return m.reply('Invalid mode. Use delete, warn, or kick');
  
  let chat = global.db.data.chats[m.chat];
  chat.antiLinkMode = mode;
  m.reply(`Anti-link mode set to: ${mode}`);
}