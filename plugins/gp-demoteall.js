let handler = async (m, { conn, usedPrefix, command }) => {
    if (!m.isGroup) return m.reply(`✳️ This command can only be used in groups`);
    
    // Check if user is admin
    const isAdmin = await conn.groupMetadata(m.chat).then(metadata => 
        metadata.participants.find(p => p.id === m.sender)?.admin
    );
    if (!isAdmin) return m.reply(`✳️ You need to be an admin to use this command`);
    
    // Get all current admins except yourself and the bot
    const groupMetadata = await conn.groupMetadata(m.chat);
    const admins = groupMetadata.participants
        .filter(p => p.admin && !p.id.includes(conn.user.jid) && p.id !== m.sender)
        .map(p => p.id);
    
    if (admins.length === 0) return m.reply(`✳️ There are no other admins to demote`);
    
    // Demote all admins
    await conn.groupParticipantsUpdate(m.chat, admins, 'demote');
    m.reply(`✅ Successfully demoted all admins`);
}

handler.help = ['demoteall']
handler.tags = ['group']
handler.command = ['demoteall', 'degradetodos'] 
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler